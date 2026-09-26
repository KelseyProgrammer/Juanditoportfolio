/**
 * Videos — motion frames for the Darkroom, hosted on Mux.
 *
 * Nothing here until the client's footage arrives. To add clips:
 *
 *   1. Set MUX_TOKEN_ID / MUX_TOKEN_SECRET (Mux dashboard → Settings →
 *      Access Tokens, "Mux Video" read+write).
 *   2. Run:  node scripts/mux-ingest.mjs <files or URLs...>
 *   3. Paste the printed entries below and fill in `series` + `alt`.
 *
 * Each video appends to the end of its series' film strip, labeled
 * MOV 01, MOV 02, … in array order. See docs/VIDEO.md for the full
 * runbook.
 */

export type Video = {
  playbackId: string; // Mux playback ID (public policy)
  series: string;     // slug of the series this clip belongs to (see lib/series.ts)
  alt: string;        // what the clip shows, for screen readers
  w: number;          // aspect ratio, e.g. 16 x 9 — exact pixels not needed
  h: number;
  duration: number;   // seconds, rounded
};

export const videos: Video[] = [
  // { playbackId: "abc123", series: "zan", alt: "Zan — behind the scenes", w: 16, h: 9, duration: 47 },
];

/**
 * Mux environment key — public, enables playback analytics (Mux Data).
 * This is NOT the API access token; ingestion needs MUX_TOKEN_ID +
 * MUX_TOKEN_SECRET in the shell (never committed).
 */
export const MUX_ENV_KEY = "3rclipmvit6nptb9shbp02en7";

/** Poster frame served straight from Mux (no upload needed). */
export const muxPoster = (playbackId: string, width = 1200) =>
  `https://image.mux.com/${playbackId}/thumbnail.jpg?width=${width}`;

/** 47 → "0:47", 143 → "2:23" */
export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};
