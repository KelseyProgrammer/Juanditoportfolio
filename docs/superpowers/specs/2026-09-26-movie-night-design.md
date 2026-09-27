# Movie Night — the CRT television for motion work

**Date:** 2026-09-26
**Status:** Approved design, pre-implementation

## Why

The client delivered 10 video clips (ingested to Mux, all assets ready). Only
one — Maile — belongs to an existing Darkroom photo series; the site requires
every clip to attach to a photo series, so the other 9 had no home. Mixing
video-only series into the Darkroom grid was rejected as chaotic. Instead,
motion work gets its own standout section that matches the site's analog
aesthetic: an old CRT television you turn on and channel-surf.

## Decisions (all confirmed with the owner)

| Decision | Choice |
|---|---|
| Concept | One CRT "channel surfer" TV; each clip is a channel, CH 01–10 |
| Placement | New homepage section between The Darkroom and About, with a nav anchor |
| Name | **Movie Night** (section heading + nav link) |
| Playback | "Live broadcast": after power-on, channels autoplay muted; speaker toggle unmutes |
| Aspect | Fixed 4:3 tube; 16:9 letterboxes slightly, 9:16 pillarboxes with animated static fill |
| Maile clip | Lives in both places: TV channel **and** MOV frame at the end of the Maile film strip |
| Clip end | Auto-advance to the next channel (wraps CH 10 → CH 01) |
| Mobile | Tube stays 4:3; fullscreen button on the set is the vertical-footage escape hatch |

## Data model — `lib/videos.ts`

`Video` gains `title` (channel display name); `series` becomes optional and
means "this clip ALSO rides that Darkroom film strip":

```ts
export type Video = {
  playbackId: string;
  title: string;        // channel name, e.g. "Brent Neale Jewelry"
  alt: string;          // what the clip shows, for screen readers
  w: number;            // real aspect ratio (16x9 or 9x16)
  h: number;
  duration: number;     // seconds, rounded
  series?: string;      // optional — slug of a photo series this clip also joins
};
```

Channel number = array index + 1; reordering channels is reordering the array.

The 10 channels (playback IDs verified ready on Mux, 2026-09-26; order is
initial curation — 16:9 lead, easily reshuffled):

| CH | title | playbackId | aspect | duration |
|---|---|---|---|---|
| 01 | Find the Light | `1x4SJ5h00d9YCottD7y7NRTuBZlZ3iXe4Exx77iJ7cf00` | 16:9 | 92 |
| 02 | Maile (`series: "maile"`) | `ZffZ234XJ02957n3zaMipjiYRh2lTncncYutMmMFIZRg` | 16:9 | 59 |
| 03 | Brent Neale Jewelry | `ooM3rjqzpkaRtooEj7fo7mO5bsWvc1REi4EjlF69Yqs` | 16:9 | 45 |
| 04 | Brent Neale Ocean | `4AkVYlgDN4REGCgmjh3hKZwGYoy6lcSI7JdWs3Bmfas` | 16:9 | 49 |
| 05 | Veronica Beard Summer 26 | `s013cK018DiYMcMJ2HfrS7jz4da19o009vGOdM2vIRhLJE` | 16:9 | 25 |
| 06 | Lily Pulitzer | `u3SuzN7COexl8SEr6Bd1wPlczzWeXVZpfaaIM0100dn8c` | 9:16 | 30 |
| 07 | Lily Pulitzer Summer 26 | `U9MFWvetUKWBr77rcx1DyxPmOxkMIQWXbxHZ7V3CTpU` | 9:16 | 22 |
| 08 | CARACARA NYC | `oTJ537mPs9h6nKWOmGO02BMNvBwvjn1kFD2P5XbgsDGY` | 9:16 | 34 |
| 09 | BC Surf and Sport | `aW7OLKOaYPWaASUUhq0100k5SawhZcqPv9iS8WMKeXb64` | 9:16 | 50 |
| 10 | West Palm Beach Magazine | `SEI128cL8QK87TOVAoOxN9TO8MF4Ou73Dps8bdcbGyM` | 9:16 | 104 |

`alt` text: one sentence per clip describing the footage (written at
implementation time; poster frames at `image.mux.com/<id>/thumbnail.jpg` show
the content).

**Post-implementation note:** the client's filenames (and this table) carry a
brand typo — the shipped titles for CH 06/07 use the correct spelling
**"Lilly Pulitzer"** (two l's). Don't "fix" the code back to match this table.

`lib/series.ts` change: in `buildSeries()`, videos with no `series` are
skipped silently (today an unknown slug warns; `undefined` must not warn).
Everything else in the Darkroom is untouched.

## Component — `components/MovieNight.tsx`

One new client component rendered in `app/page.tsx` between `<Darkroom />` and
`<About />`, section `id="movie-night"`. `components/Nav.tsx` gains the anchor
link "Movie Night".

Anatomy:

- **Section band** — dim living-room backdrop in the `#191410` family; heading
  "Movie Night" in `font-display` and a `font-stamp` caption
  ("10 channels · dial to surf"), matching the Darkroom header pattern.
- **Cabinet** — bakelite/wood-toned body, cream `#F1E8D6` dial markings,
  rounded corners, drop shadow. Width `min(88vw, 720px)`.
- **Tube** — fixed 4:3 box: corner rounding, inset vignette, faint glass
  glare, scanline overlay via a static `repeating-linear-gradient` (no
  animation cost).
- **Screen content** — exactly one mounted Mux player (the existing code-split
  `@mux/mux-player-react`), chrome hidden; the set's own controls do
  everything. 16:9 letterboxes; 9:16 centers with animated static pillars.
- **Controls on the set** — power switch, channel dial (click = next channel,
  knob rotates), CH ▲/▼ buttons, mute/unmute toggle, fullscreen button. All
  real `<button>`s with `aria-label`s, styled as hardware.
- **Label plate** — under the tube, stamp type:
  `CH 04 · BRENT NEALE OCEAN · 0:49`.

Static texture: a small data-URI noise image, jittered with a `steps()`
`background-position` animation. No canvas, no runtime SVG turbulence, and no
element keeps a GPU layer after a burst ends (same discipline as the
Darkroom's develop effect).

## Behavior

- **Off (default):** dark tube with faint reflection; zero video bytes loaded.
- **Power on:** ~400 ms static burst → CH 01 playing, muted. The click is the
  user gesture; muted autoplay is allowed regardless.
- **Channel change** (dial, CH buttons, or ↑/↓ while the TV has focus):
  static burst → next clip autoplaying muted → "CH 05" OSD glows in a corner
  and fades after ~1.5 s.
- **Sound:** starts muted; speaker toggle unmutes; mute state persists across
  channel flips.
- **Clip end:** static burst, auto-advance to the next channel, wrapping.
- **Power off:** collapse-to-a-line flicker; player unmounts.
- **Reduced motion (`prefers-reduced-motion`):** no bursts or flicker — hard
  cuts, and channels render poster frames with an explicit play button
  instead of autoplaying.
- **Keyboard scope:** ↑/↓ change channels only while focus is inside the TV
  (no global listeners fighting page scroll).

## Performance & edge cases

- Only the active channel's player mounts; the Mux player chunk stays
  code-split and loads on power-on at the earliest.
- Mux Data analytics keep flowing via the committed `MUX_ENV_KEY`.
- Empty `videos` array → the section renders `null` (and the nav link hides).
- Stream error → tube shows static with a `NO SIGNAL` OSD.
- Bandwidth: live-broadcast surfing costs delivery minutes per flip —
  comfortably inside Mux's free 100k min/mo at this site's traffic.

## Out of scope

- No changes to the Darkroom grid, film-strip mechanics, or `SERIES` record
  (the Maile clip uses the already-built MOV-frame path).
- No URL state for channels (`?ch=4` can come later if ever wanted).
- No new ingest tooling; `scripts/mux-ingest.mjs` stays as-is. Its printed
  entry format will drift from the new `Video` shape — acceptable; noted in
  `docs/VIDEO.md` at implementation time.

## Verification

`npm run build` clean, then a manual dev-server pass: power on/off, all 10
channels, both aspect treatments, keyboard nav, reduced-motion mode, and
phone-width layout. **No push to `main` without an explicit OK** — it
auto-deploys production via Netlify.
