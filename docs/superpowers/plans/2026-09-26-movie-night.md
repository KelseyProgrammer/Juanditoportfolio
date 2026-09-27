# Movie Night Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the "Movie Night" homepage section — a CSS-built CRT television that channel-surfs the client's 10 Mux clips (spec: `docs/superpowers/specs/2026-09-26-movie-night-design.md`).

**Architecture:** One new client component (`components/MovieNight.tsx`) renders the TV; all channel data lives in `lib/videos.ts` (extended `Video` type, 10 entries). CRT dressing (static, scanlines, OSD, power-off collapse) is pure CSS in `app/globals.css`. `lib/series.ts` gets a one-line guard so TV-only clips (no `series` field) don't warn. Wiring: `app/page.tsx` + `components/Nav.tsx`.

**Tech Stack:** Next.js 15 (App Router), React 18, Tailwind 3, `@mux/mux-player-react` (already installed, code-split via `next/dynamic`), `framer-motion` only for `useReducedMotion`.

**Testing note:** This repo has no test framework (see `package.json` — scripts are dev/build/start/lint only), and the approved spec defines verification as `npm run build` + a manual dev-server pass. Steps below therefore verify with `npx tsc --noEmit`, `npm run build`, and a final manual checklist instead of unit tests. Do not add a test framework for this feature.

**Facts verified against the installed `@mux/mux-player-react@3.x` types** (`node_modules/@mux/mux-player-react/dist/types/types.d.ts`): props `nohotkeys?: boolean`, `autoPlay: boolean | string`, `muted: boolean`, `onEnded`, `onError` all exist. Player chrome is hidden with the CSS var `--controls: "none"`.

**Design-system constraints** (from existing code comments/patterns): corner radius is 0px or a perfect circle, nothing between (`app/globals.css` sprockets comment). Palette: paper `#F1E8D6`, ink `#2E2620`, safelight red `#E5301F`, darkroom black `#191410`. Section headers use `font-display` + a `font-stamp` red caption (see `components/Darkroom.tsx:274-281`). Never push to `main` without the owner's explicit OK — it auto-deploys production.

---

### Task 1: Channel data (`lib/videos.ts`) + series guard (`lib/series.ts`)

**Files:**
- Modify: `lib/videos.ts` (type + `videos` array + `muxPoster`)
- Modify: `lib/series.ts:94-99` (skip TV-only clips)

- [ ] **Step 1: Rewrite the data section of `lib/videos.ts`**

Replace the `Video` type and the `videos` array (keep the file's header comment, `MUX_ENV_KEY`, and `formatDuration` as they are; `muxPoster` changes in Step 2). New type — `title` is the channel's display name, `series` is now optional and means "this clip ALSO rides that Darkroom film strip", `posterTime` overrides Mux's default (time-0) thumbnail:

```ts
export type Video = {
  playbackId: string;  // Mux playback ID (public policy)
  title: string;       // channel display name, e.g. "Brent Neale Jewelry"
  alt: string;         // what the clip shows, for screen readers
  w: number;           // aspect ratio, e.g. 16 x 9 — exact pixels not needed
  h: number;
  duration: number;    // seconds, rounded
  series?: string;     // slug of a photo series this clip also joins (lib/series.ts)
  posterTime?: number; // seconds — poster frame, when the clip opens on a blank frame
};
```

The 10 channels (channel number = array index + 1; playback IDs and durations verified against the Mux API 2026-09-26):

```ts
export const videos: Video[] = [
  { playbackId: "1x4SJ5h00d9YCottD7y7NRTuBZlZ3iXe4Exx77iJ7cf00", title: "Find the Light", alt: "A model in a wide-brimmed straw hat tied with a peach ribbon closes her eyes in the sun against a deep blue sky", w: 16, h: 9, duration: 92 },
  { playbackId: "ZffZ234XJ02957n3zaMipjiYRh2lTncncYutMmMFIZRg", title: "Maile", alt: "Maile smiles against a wooden fence in a snakeskin-print dress, pink daisies double-exposed over the frame", w: 16, h: 9, duration: 59, series: "maile" },
  { playbackId: "ooM3rjqzpkaRtooEj7fo7mO5bsWvc1REi4EjlF69Yqs", title: "Brent Neale Jewelry", alt: "Close-up of a model brushing back her hair to show gold flower earrings and cocktail rings, greenery glowing behind", w: 16, h: 9, duration: 45 },
  { playbackId: "4AkVYlgDN4REGCgmjh3hKZwGYoy6lcSI7JdWs3Bmfas", title: "Brent Neale Ocean", alt: "Hands stacked with gemstone rings rest on a sheer peach dress among coastal rocks", w: 16, h: 9, duration: 49 },
  { playbackId: "s013cK018DiYMcMJ2HfrS7jz4da19o009vGOdM2vIRhLJE", title: "Veronica Beard Summer 26", alt: "A model in a black mini dress leans on a white seaside terrace beside an orange telescope viewer, the ocean behind her", w: 16, h: 9, duration: 25 },
  { playbackId: "u3SuzN7COexl8SEr6Bd1wPlczzWeXVZpfaaIM0100dn8c", title: "Lily Pulitzer", alt: "A model in a fruit-appliqué cardigan and orange skirt strolls a produce market past crates of guavas and oranges", w: 9, h: 16, duration: 30 },
  { playbackId: "U9MFWvetUKWBr77rcx1DyxPmOxkMIQWXbxHZ7V3CTpU", title: "Lily Pulitzer Summer 26", alt: "Two girls in pink dresses run hand in hand across a sunlit lawn under palm trees", w: 9, h: 16, duration: 22 },
  { playbackId: "oTJ537mPs9h6nKWOmGO02BMNvBwvjn1kFD2P5XbgsDGY", title: "CARACARA NYC", alt: "A braided bridle and green lead rope hang from a white pasture fence, hills soft in the distance", w: 9, h: 16, duration: 34, posterTime: 10 },
  { playbackId: "aW7OLKOaYPWaASUUhq0100k5SawhZcqPv9iS8WMKeXb64", title: "BC Surf and Sport", alt: "A tattooed surfer in a tie-dye bikini carries her board along the shore by a weathered pier", w: 9, h: 16, duration: 50 },
  { playbackId: "SEI128cL8QK87TOVAoOxN9TO8MF4Ou73Dps8bdcbGyM", title: "West Palm Beach Magazine", alt: "Sun falls across a navy Honey Fitz presidential-yacht pillow on a deck chair aboard the yacht", w: 9, h: 16, duration: 104 },
];
```

Also update the file's header comment: the ingest-runbook lines ("Nothing here until the client's footage arrives…") are stale — replace that paragraph with: `Channels for Movie Night (components/MovieNight.tsx), in channel order — CH 01 is index 0. A clip with a `series` slug ALSO rides that series' film strip as a MOV frame.`

- [ ] **Step 2: Extend `muxPoster` with an optional time**

Replace the existing `muxPoster` in `lib/videos.ts`:

```ts
/** Poster frame served straight from Mux (no upload needed). */
export const muxPoster = (playbackId: string, width = 1200, time?: number) =>
  `https://image.mux.com/${playbackId}/thumbnail.jpg?width=${width}${time !== undefined ? `&time=${time}` : ""}`;
```

Existing callers in `components/FilmStrip.tsx` pass one or two args and are unaffected.

- [ ] **Step 3: Guard TV-only clips in `lib/series.ts`**

In `buildSeries()`, the videos loop currently starts (`lib/series.ts:94-100`):

```ts
  videos.forEach((video, videoIndex) => {
    if (!bySlug.has(video.series)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[series] video "${video.playbackId}" names unknown series "${video.series}" — skipped`);
      }
      return;
    }
```

Replace those lines with (TV-only clips are silent; a *named but unknown* slug still warns):

```ts
  videos.forEach((video, videoIndex) => {
    if (!video.series) return; // TV-only clip — Movie Night is its home
    if (!bySlug.has(video.series)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[series] video "${video.playbackId}" names unknown series "${video.series}" — skipped`);
      }
      return;
    }
```

The two later uses (`videosBySlug.get(video.series)` / `.set(video.series, …)`) now sit behind the guard, so `video.series` narrows to `string` and TypeScript stays happy.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0 with no output. (If it errors in `FilmStrip.tsx` about `video.alt`/`video.title`, you renamed rather than added — `alt` must still exist.)

- [ ] **Step 5: Commit**

```bash
git add lib/videos.ts lib/series.ts
git commit -m "Channel data for Movie Night: 10 Mux clips, series now optional on Video"
```

---

### Task 2: CRT CSS (`app/globals.css`)

**Files:**
- Modify: `app/globals.css` (append after the `.rail-scroll` rules at the end of the file)

- [ ] **Step 1: Append the Movie Night styles**

```css
/* ——— Movie Night ——— */

/* Same rationale as the darkroom: rust vanishes on the dark band. */
#movie-night :focus-visible {
  outline-color: #E5301F;
}

/* Analog static: one SVG-turbulence tile, jittered with hard steps so it
   reads as broadcast snow. No canvas, no runtime filters — the tile is
   rasterized once and only background-position animates. */
.tv-static {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  animation: tv-static-jitter 0.4s step-end infinite;
}

@keyframes tv-static-jitter {
  0% { background-position: 0 0; }
  20% { background-position: -96px 64px; }
  40% { background-position: 64px -128px; }
  60% { background-position: -32px -64px; }
  80% { background-position: 128px 32px; }
  100% { background-position: 0 0; }
}

/* Tube dressing: glass glare up-left, scanlines, corner vignette. */
.tv-scanlines {
  background-image:
    radial-gradient(ellipse at 30% 18%, rgba(251, 246, 236, 0.08), transparent 45%),
    repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0 1px, transparent 1px 3px);
  box-shadow: inset 0 0 48px 12px rgba(0, 0, 0, 0.55);
}

/* Dark tube while the set is off — just a hint of room reflection. */
.tv-glass-off {
  background: radial-gradient(ellipse at 35% 25%, rgba(241, 232, 214, 0.06), transparent 55%);
}

/* On-screen channel number: glow in, hold, fade — like a 90s OSD. */
.tv-osd {
  animation: tv-osd 1.5s ease-out both;
  text-shadow: 0 0 6px rgba(241, 232, 214, 0.9);
}

@keyframes tv-osd {
  0% { opacity: 0; }
  10% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

/* Power-off: the picture collapses to a bright line, then winks out. */
.tv-off {
  animation: tv-off 0.35s ease-in both;
}

@keyframes tv-off {
  0% { transform: scaleY(1); opacity: 0.9; }
  60% { transform: scaleY(0.01); opacity: 1; }
  100% { transform: scaleY(0.01) scaleX(0); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .tv-static,
  .tv-off {
    animation: none;
  }
  .tv-osd {
    animation: none;
    opacity: 0;
  }
}
```

- [ ] **Step 2: Verify the stylesheet still compiles**

Run: `npm run build`
Expected: "Compiled successfully" (a CSS syntax error — usually an unescaped character in the data URI — fails the build here).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "CRT dressing for Movie Night: static, scanlines, OSD, power-off collapse"
```

---

### Task 3: The television (`components/MovieNight.tsx`)

**Files:**
- Create: `components/MovieNight.tsx`

- [ ] **Step 1: Create the component**

Complete file contents:

```tsx
"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { videos, muxPoster, formatDuration, MUX_ENV_KEY } from "@/lib/videos";

// Same code-split as the film strip: the Mux chunk loads only when the
// set is switched on for the first time.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/**
 * Movie Night — the motion archive as an old CRT television.
 *
 * Off by default (no video bytes). The power switch is the user gesture:
 * from then on every channel is a live broadcast — flip to it and it's
 * already playing, muted, behind a burst of static. The dial and CH keys
 * surf; clips auto-advance to the next channel when they end.
 *
 * Reduced motion: no static, no flicker, and channels wait as poster
 * frames behind an explicit play button instead of autoplaying.
 */

const STATIC_BURST_MS = 400;
const POWER_OFF_MS = 350;

const pad = (n: number) => String(n).padStart(2, "0");

export default function MovieNight() {
  const reduceMotion = useReducedMotion();
  const [power, setPower] = useState(false);
  const [poweringOff, setPoweringOff] = useState(false);
  const [channel, setChannel] = useState(0);
  // Dial rotation accumulates so wrapping CH 10 → CH 01 keeps spinning
  // forward instead of unwinding a full turn.
  const [turns, setTurns] = useState(0);
  const [muted, setMuted] = useState(true);
  const [burst, setBurst] = useState(false);
  const [osdKey, setOsdKey] = useState(0); // remount restarts the OSD fade
  const [error, setError] = useState(false);
  const [armed, setArmed] = useState(false); // reduced-motion: play pressed
  const [canFullscreen, setCanFullscreen] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();
  const offTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // iPhone Safari has no element fullscreen; we fall back to the native
    // video's webkitEnterFullscreen there, so the button stays.
    setCanFullscreen(
      document.fullscreenEnabled || /iPhone|iPad/.test(navigator.userAgent)
    );
    return () => {
      clearTimeout(burstTimer.current);
      clearTimeout(offTimer.current);
    };
  }, []);

  if (videos.length === 0) return null;

  const video = videos[channel];
  const vertical = video.h > video.w;

  const staticBurst = () => {
    if (reduceMotion) return;
    setBurst(true);
    clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBurst(false), STATIC_BURST_MS);
  };

  const changeChannel = (dir: 1 | -1) => {
    setChannel((c) => (c + dir + videos.length) % videos.length);
    setTurns((t) => t + dir);
    setError(false);
    setArmed(false);
    setOsdKey((k) => k + 1);
    staticBurst();
  };

  const powerOn = () => {
    setPower(true);
    setError(false);
    setArmed(false);
    setOsdKey((k) => k + 1);
    staticBurst();
  };

  const powerOff = () => {
    setPower(false);
    if (reduceMotion) return;
    setPoweringOff(true);
    clearTimeout(offTimer.current);
    offTimer.current = setTimeout(() => setPoweringOff(false), POWER_OFF_MS);
  };

  // ↑/↓ surf while focus is anywhere inside the set — no global listeners.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!power) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      changeChannel(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      changeChannel(-1);
    }
  };

  const goFullscreen = () => {
    const el = screenRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen();
      return;
    }
    // iPhone: only the native <video> may enter fullscreen. mux-player
    // exposes it as .media.nativeEl on the custom element.
    const player = el?.querySelector("mux-player") as
      | { media?: { nativeEl?: HTMLVideoElement & { webkitEnterFullscreen?: () => void } } }
      | null;
    player?.media?.nativeEl?.webkitEnterFullscreen?.();
  };

  const knob =
    "flex h-9 w-9 items-center justify-center border border-[#F1E8D6]/30 font-stamp text-[9px] uppercase tracking-[0.08em] text-[#F1E8D6]/70 transition-colors hover:text-[#F1E8D6] disabled:pointer-events-none disabled:opacity-30";

  return (
    <section
      id="movie-night"
      className="border-t border-[#F1E8D6]/15 bg-[#191410] px-6 py-16 md:px-14"
    >
      <div className="mb-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h2 className="font-display text-3xl text-[#F1E8D6]/75 md:text-4xl">
          Movie Night
        </h2>
        <p className="font-stamp text-xs uppercase tracking-widest text-[#E5301F]">
          {videos.length} channels · dial to surf
        </p>
      </div>

      {/* The set */}
      <div className="mx-auto w-[min(88vw,720px)]" onKeyDown={onKeyDown}>
        <div className="bg-ink p-3 shadow-[0_24px_60px_rgba(0,0,0,0.55)] md:p-5">
          <div className="flex gap-3 md:gap-5">
            {/* Tube */}
            <div
              ref={screenRef}
              className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden bg-black"
            >
              {/* Vertical clips sit on a bed of quiet static */}
              {power && vertical && !reduceMotion && !error && (
                <div aria-hidden className="tv-static absolute inset-0 opacity-30" />
              )}

              {power &&
                !error &&
                (reduceMotion && !armed ? (
                  <>
                    <Image
                      src={muxPoster(video.playbackId, 960, video.posterTime)}
                      alt={video.alt}
                      fill
                      sizes="(max-width: 768px) 88vw, 720px"
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setArmed(true)}
                      aria-label={`Play ${video.title}`}
                      className="absolute inset-0 z-10 flex items-center justify-center font-stamp text-sm uppercase tracking-[0.18em] text-[#F1E8D6]"
                    >
                      <span className="border border-[#E5301F]/70 bg-[#191410]/70 px-4 py-2 text-[#E5301F]">
                        ▸ Play
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="relative max-h-full max-w-full"
                      style={{
                        aspectRatio: `${video.w} / ${video.h}`,
                        height: vertical ? "100%" : undefined,
                        width: vertical ? undefined : "100%",
                      }}
                    >
                      <MuxPlayer
                        key={video.playbackId}
                        playbackId={video.playbackId}
                        poster={muxPoster(video.playbackId, 960, video.posterTime)}
                        streamType="on-demand"
                        autoPlay
                        muted={muted}
                        nohotkeys
                        accentColor="#E5301F"
                        envKey={MUX_ENV_KEY}
                        metadata={{ video_title: video.title }}
                        onEnded={() => changeChannel(1)}
                        onError={() => setError(true)}
                        style={
                          {
                            "--controls": "none",
                            height: "100%",
                            width: "100%",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                ))}

              {/* Lost the feed */}
              {power && error && (
                <div className="tv-static absolute inset-0 z-10 flex items-center justify-center">
                  <span className="bg-[#191410]/80 px-3 py-1 font-stamp text-xs uppercase tracking-[0.18em] text-[#F1E8D6]">
                    No Signal
                  </span>
                </div>
              )}

              {/* Channel-change snow */}
              {burst && <div aria-hidden className="tv-static absolute inset-0 z-20" />}

              {/* Channel OSD */}
              {power && !reduceMotion && (
                <span
                  key={osdKey}
                  aria-hidden
                  className="tv-osd absolute right-3 top-2 z-30 font-stamp text-lg tracking-[0.18em] text-[#F1E8D6]"
                >
                  CH {pad(channel + 1)}
                </span>
              )}

              {/* Power-off collapse */}
              {poweringOff && (
                <div aria-hidden className="tv-off absolute inset-0 z-40 bg-[#FBF6EC]" />
              )}

              {/* Glass: scanlines + vignette while on, faint reflection while off */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 z-30 ${
                  power ? "tv-scanlines" : "tv-glass-off"
                }`}
              />
            </div>

            {/* Control panel */}
            <div className="flex w-11 shrink-0 flex-col items-center gap-2.5 md:w-12">
              {/* The dial — one notch per channel, pointer painted red */}
              <button
                type="button"
                onClick={() => changeChannel(1)}
                disabled={!power}
                aria-label="Next channel (dial)"
                className="relative h-11 w-11 rounded-full border-2 border-[#F1E8D6]/40 bg-black transition-transform duration-300 disabled:pointer-events-none disabled:opacity-30 md:h-12 md:w-12"
                style={{ transform: `rotate(${turns * (360 / videos.length)}deg)` }}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1 h-3 w-0.5 -translate-x-1/2 bg-[#E5301F]"
                />
              </button>
              <button
                type="button"
                onClick={() => changeChannel(1)}
                disabled={!power}
                aria-label="Channel up"
                className={knob}
              >
                CH▲
              </button>
              <button
                type="button"
                onClick={() => changeChannel(-1)}
                disabled={!power}
                aria-label="Channel down"
                className={knob}
              >
                CH▼
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                disabled={!power}
                aria-pressed={!muted}
                aria-label={muted ? "Turn sound on" : "Turn sound off"}
                className={`${knob} ${muted ? "" : "border-[#E5301F]/70 text-[#E5301F]"}`}
              >
                Snd
              </button>
              {canFullscreen && (
                <button
                  type="button"
                  onClick={goFullscreen}
                  disabled={!power}
                  aria-label="Watch fullscreen"
                  className={knob}
                >
                  Zoom
                </button>
              )}
              <button
                type="button"
                onClick={() => (power ? powerOff() : powerOn())}
                aria-pressed={power}
                aria-label={power ? "Turn the TV off" : "Turn the TV on"}
                className={`mt-auto flex h-9 w-9 items-center justify-center border font-stamp text-[9px] uppercase tracking-[0.08em] transition-colors ${
                  power
                    ? "border-[#E5301F] bg-[#E5301F] text-[#191410]"
                    : "border-[#E5301F]/60 text-[#E5301F] hover:bg-[#E5301F]/15"
                }`}
              >
                Pwr
              </button>
            </div>
          </div>

          {/* Label plate */}
          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#F1E8D6]/15 pt-2 font-stamp text-[11px] uppercase tracking-[0.18em]">
            <span className="truncate text-[#F1E8D6]/70">
              {power ? video.title : "Juandito Broadcasting"}
            </span>
            <span role="status" className="shrink-0 text-[#E5301F]/80">
              {power
                ? `CH ${pad(channel + 1)}/${pad(videos.length)} · ${formatDuration(video.duration)}`
                : "Off Air"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Notes for the implementer (why the code is shaped this way):
- The early `return null` sits AFTER every hook call, and `videos.length` is a module constant, so the hook count never varies between renders.
- One player mounts at a time (`key={video.playbackId}` remounts per channel); `autoPlay` + `muted={muted}` — the channel flip is itself a click, so unmuted autoplay after the user has unmuted rides that gesture's transient activation.
- The static burst overlays the incoming player while it starts loading — it doubles as a loading mask.
- Sharp corners everywhere except the dial (perfect circle): the design system allows 0px radius or a circle, nothing between.
- `bg-ink` (`#2E2620`) for the cabinet — warm bakelite against the `#191410` band.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exits 0, no output. Likely trip-ups if not: `nohotkeys` casing (it is all-lowercase in the installed types) and the `"--controls"` cast to `React.CSSProperties`.

- [ ] **Step 3: Commit**

```bash
git add components/MovieNight.tsx
git commit -m "Movie Night: CRT channel-surfer TV for the motion archive"
```

---

### Task 4: Wire into the page and nav

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/Nav.tsx`

- [ ] **Step 1: Render the section between Darkroom and About**

In `app/page.tsx`, add the import and the element:

```tsx
import MovieNight from "@/components/MovieNight";
```

```tsx
      <Darkroom />
      <MovieNight />
      <About />
```

- [ ] **Step 2: Add the nav anchor (hidden if there are no channels)**

Replace the full contents of `components/Nav.tsx` with:

```tsx
import { videos } from "@/lib/videos";

export default function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-ink px-6 py-6 md:px-14">
      <a href="#" className="font-display text-2xl">Juandito Bandito</a>
      <nav className="flex flex-wrap gap-4 font-stamp text-xs uppercase tracking-[0.14em] md:gap-9">
        <a href="#wall" className="hover:text-rust">Work</a>
        <a href="#darkroom" className="hover:text-rust">Darkroom</a>
        {videos.length > 0 && (
          <a href="#movie-night" className="hover:text-rust">Movie Night</a>
        )}
        <a href="#about" className="hover:text-rust">About</a>
        <a href="#contact" className="hover:text-rust">Contact</a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: "Compiled successfully", and the route table still shows `/` as a static page.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/Nav.tsx
git commit -m "Wire Movie Night into the page flow and nav"
```

---

### Task 5: Update the video runbook

**Files:**
- Modify: `docs/VIDEO.md`

- [ ] **Step 1: Rewrite the status header and runbook notes**

At the top of `docs/VIDEO.md`, replace the `**Status: …**` paragraph with:

```markdown
**Status: LIVE.** The client's 10 clips are ingested to Mux and play in two
places: the **Movie Night** CRT section (`components/MovieNight.tsx`, all 10
as channels CH 01–10 in `lib/videos.ts` array order) and — for clips with a
`series` slug — the end of that series' film strip as MOV frames (currently
just Maile). Design spec: `docs/superpowers/specs/2026-09-26-movie-night-design.md`.
```

And append to the end of the "Go-live runbook" section:

```markdown
**Note (2026-09):** `Video` now has `title` (channel display name) and
`series` is optional — a clip with no `series` lives only on the TV.
`scripts/mux-ingest.mjs` still prints the old entry shape; after pasting,
add `title` and drop `series` unless the clip should also join a film strip.
```

- [ ] **Step 2: Commit**

```bash
git add docs/VIDEO.md
git commit -m "VIDEO.md: Movie Night is live; note the new Video entry shape"
```

---

### Task 6: Manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` and open `http://localhost:3000/#movie-night`.

- [ ] **Step 2: Walk the checklist**

- Set renders between Darkroom and About; tube dark, label plate reads "Juandito Broadcasting · Off Air"; nav has "Movie Night".
- PWR → static burst → CH 01 (Find the Light) playing muted; OSD "CH 01" fades.
- Dial and CH▲/CH▼ surf with static between; dial keeps rotating forward across the CH 10 → CH 01 wrap.
- CH 06–10 (the verticals) show centered with animated static pillars; CH 01–05 letterbox.
- CH 08 (CARACARA) shows the pasture poster, not a white frame, while loading.
- SND unmutes; flipping channels keeps the sound state.
- Let a short clip (CH 07, 22s) end → auto-advance to CH 08 with a burst.
- ↑/↓ arrows surf while focus is inside the set; page scroll is untouched when focus is elsewhere.
- ZOOM goes fullscreen and back.
- PWR off → collapse-to-line flicker → dark tube.
- With system reduced motion on (macOS: System Settings → Accessibility → Display → Reduce motion): no static or flicker, channels show a poster + ▸ Play button, play works.
- Phone width (devtools, 390px): set fits, controls tappable, label plate truncates gracefully.
- Console: no errors; no Mux network requests before first power-on (check the Network tab from a fresh load).

- [ ] **Step 3: Final build**

Run: `npm run build`
Expected: "Compiled successfully".

- [ ] **Step 4: STOP — do not push**

`main` auto-deploys production via Netlify. Report verification results to the owner and wait for their explicit OK to push.
