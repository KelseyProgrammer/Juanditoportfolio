# Video support — plan (not yet built)

The client will be sending video files. This is the agreed proposal for
hosting them and fitting them into the site's film language. Pricing was
verified against vendor pages in September 2026 — re-check before signing up.

Scale assumption: 5–20 clips, 15s–3min each, ~1–2 GB total, light traffic
(a few hundred visitors/month).

## Hosting

Hard rule either way: **no video bytes in the repo or the Netlify deploy** —
only URLs in `lib/photos.ts`. Netlify's own Large Media product is dead
(deprecated Sept 1, 2023) and their Image CDN is images-only.

| Option | Cost at this scale | Encoding / posters | Effort |
|---|---|---|---|
| **Cloudflare R2 + plain `<video>`** | $0 (10 GB storage free, zero egress) | None — one ffmpeg pass per clip (H.264 MP4 + poster JPG) | Medium prep, trivial code |
| **Bunny Stream** | ~$1/mo ($1 account minimum; storage $0.01/GB, delivery $0.005/GB) | Automatic (HLS + thumbnails; opt-in direct MP4 URLs) | Low — MP4 URL + `<video>`, or hls.js |
| **Mux** | ~$0 (100k delivery min/mo free + $20/mo PAYG credit; storage ~$0.09/mo) | Automatic (HLS/ABR + thumbnail API) | Lowest — `@mux/mux-player-react` |
| Cloudinary | ✗ | free tier caps videos at **100 MB each**; next plan $89+/mo | ruled out |
| Netlify Large Media | ✗ | deprecated Sept 2023 | ruled out |
| Cloudflare Stream | ✗ | ~$5–6/mo minimum, no free tier | ruled out at this scale |
| YouTube / Vimeo unlisted | ✗ | off-brand chrome, related-video suggestions | ruled out for a portfolio |

**Recommendation:** cheapest-and-simple is **R2 + plain `<video>`** ($0,
one ffmpeg pass per clip — fine for short portfolio clips at this traffic).
If the ffmpeg step is unwanted or footage keeps coming: **Mux** (effectively
free under current credits, auto-encoding, best React player), with
**Bunny Stream** (~$1/mo) as the fallback that doesn't depend on a credit
system staying generous.

Encoding baseline for the R2 route: H.264 MP4, 1080p, ~8 Mbps max, plus a
poster JPG per clip. WebM/HLS only if a host generates them for free
(Mux and Bunny do).

## How it fits the design

- Extend the frame type with a media discriminator:
  `{ kind: "photo", ... } | { kind: "video", src, poster, w, h, duration }`.
  Video frames sit inline in a series' film strip alongside photos, marked
  with a small duration tag in the `FR ###` label row.
- In the strip: active video frame shows its poster + a play button; full
  controls on play. Never autoplay with sound.
- Mobile/data: `preload="none"` + poster everywhere — no video bytes load
  until the visitor taps play.
- Deferred until real footage exists: a muted looping hero preview
  (autoplay-on-hover on desktop, poster-only on mobile), and any separate
  "reel" section — the film-strip metaphor already accommodates mixed media;
  revisit if the client sends long-form work.

## Ask the client before building

- Source resolution + frame rate (1080p or 4K? 24/30/60fps?) and typical length.
- Aspect ratios (16:9? vertical 4:5 / 9:16? mixed?) — affects strip frame layout.
- Does audio matter (interviews/music) or are these silent b-roll loops?
- Rough clip count and cadence (five once, or ongoing?) — affects host choice.
- Do they have poster stills per clip, or should we extract frames?
