#!/usr/bin/env node
/**
 * Ingest video files into Mux and print paste-ready entries for
 * lib/videos.ts. See docs/VIDEO.md for the full runbook.
 *
 * Usage:
 *   MUX_TOKEN_ID=... MUX_TOKEN_SECRET=... node scripts/mux-ingest.mjs [--series=slug] <files or URLs...>
 *
 * Accepts local file paths and https URLs (Dropbox share links are
 * auto-converted to direct downloads). Uses Mux "basic" video quality
 * (free encoding) and public playback. Waits until each asset is ready,
 * then prints the entries to paste into `videos` in lib/videos.ts.
 */

import fs from "node:fs";
import path from "node:path";

// Credentials come from the shell or from .env in the repo root (gitignored).
try {
  process.loadEnvFile(new URL("../.env", import.meta.url).pathname);
} catch {
  // no .env — fine, the shell may provide the vars
}

const API = "https://api.mux.com/video/v1";
const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error(
    "Set MUX_TOKEN_ID and MUX_TOKEN_SECRET first.\n" +
      "Create them in the Mux dashboard: Settings → Access Tokens → Generate new token\n" +
      "(environment: Production, permissions: Mux Video read + write)."
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const seriesArg = args.find((a) => a.startsWith("--series="))?.slice(9) ?? "TODO-series-slug";
const inputs = args.filter((a) => !a.startsWith("--"));

if (inputs.length === 0) {
  console.error("Nothing to ingest. Pass one or more video files or https URLs.");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64");

async function mux(method, endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Mux ${method} ${endpoint} → ${res.status}: ${JSON.stringify(json)}`);
  }
  return json.data;
}

const NEW_ASSET_SETTINGS = {
  playback_policy: ["public"],
  video_quality: "basic", // free encoding tier — plenty for portfolio clips
};

/** Dropbox share links need dl=1 to serve the raw file. */
function directUrl(url) {
  if (!url.includes("dropbox.com")) return url;
  const u = new URL(url);
  u.searchParams.set("dl", "1");
  return u.toString();
}

async function ingestUrl(url) {
  const asset = await mux("POST", "/assets", {
    input: [{ url: directUrl(url) }],
    ...NEW_ASSET_SETTINGS,
  });
  return asset.id;
}

async function ingestFile(filePath) {
  const upload = await mux("POST", "/uploads", {
    cors_origin: "*",
    new_asset_settings: NEW_ASSET_SETTINGS,
  });
  const size = fs.statSync(filePath).size;
  process.stdout.write(`  uploading ${path.basename(filePath)} (${(size / 1e6).toFixed(1)} MB)... `);
  const res = await fetch(upload.url, {
    method: "PUT",
    headers: { "Content-Length": String(size) },
    body: fs.createReadStream(filePath),
    duplex: "half",
  });
  if (!res.ok) throw new Error(`upload PUT failed: ${res.status}`);
  console.log("done");

  // The upload resolves to an asset id shortly after the PUT completes.
  for (let i = 0; i < 60; i++) {
    const u = await mux("GET", `/uploads/${upload.id}`);
    if (u.asset_id) return u.asset_id;
    if (u.status === "errored") throw new Error(`upload errored: ${JSON.stringify(u.error)}`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("upload never produced an asset (timed out)");
}

async function waitForReady(assetId, label) {
  for (let i = 0; i < 180; i++) {
    const asset = await mux("GET", `/assets/${assetId}`);
    if (asset.status === "ready") return asset;
    if (asset.status === "errored") {
      throw new Error(`asset ${assetId} errored: ${JSON.stringify(asset.errors)}`);
    }
    process.stdout.write(`\r  ${label}: ${asset.status}... (${i * 5}s)`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`asset ${assetId} not ready after 15 minutes`);
}

const entries = [];
for (const input of inputs) {
  const isUrl = /^https?:\/\//.test(input);
  const label = isUrl ? new URL(input).pathname.split("/").pop() || input : path.basename(input);
  console.log(`\n▸ ${label}`);
  if (!isUrl && !fs.existsSync(input)) {
    console.error(`  not found on disk, skipping: ${input}`);
    continue;
  }
  try {
    const assetId = isUrl ? await ingestUrl(input) : await ingestFile(input);
    const asset = await waitForReady(assetId, label);
    console.log(`\r  ready ✓ asset ${assetId}                     `);
    const [w, h] = (asset.aspect_ratio ?? "16:9").split(":").map(Number);
    entries.push({
      playbackId: asset.playback_ids?.[0]?.id,
      series: seriesArg,
      alt: `TODO — describe ${label}`,
      w: w || 16,
      h: h || 9,
      duration: Math.round(asset.duration ?? 0),
    });
  } catch (err) {
    console.error(`  FAILED: ${err.message}`);
  }
}

if (entries.length === 0) {
  console.error("\nNo assets ingested.");
  process.exit(1);
}

console.log("\n" + "─".repeat(60));
console.log("Paste into `videos` in lib/videos.ts (fill in series + alt):\n");
for (const e of entries) {
  console.log(
    `  { playbackId: ${JSON.stringify(e.playbackId)}, series: ${JSON.stringify(e.series)}, alt: ${JSON.stringify(e.alt)}, w: ${e.w}, h: ${e.h}, duration: ${e.duration} },`
  );
}
console.log("\nThen: npm run build && git commit && git push (deploys via Netlify).");
