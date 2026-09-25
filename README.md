# Juandito — Portfolio (Sun Journal)

Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion

## 1. Get it running

```bash
# inside your cloned repo
cp -r /path/to/juandito-portfolio/* .   # or unzip into the repo root
npm install
npm run dev                              # http://localhost:3000
```

Drop real photos into `public/photos/` and update `lib/photos.ts` (src, alt, caption, note).
Everything bracketed like `[YOUR BIO]` is a placeholder to replace.

## 2. Refine the design with Impeccable

Impeccable is an agent skill — it works through Claude Code / Cursor / Codex, not as an npm package in the app.

```bash
npx impeccable install      # pick your coding tool when prompted
```

Then, in your coding agent:

```
/impeccable init            # writes PRODUCT.md + DESIGN.md from this codebase
/impeccable polish          # final quality pass, removes "AI tells"
/impeccable typeset         # tighten type hierarchy (hero, captions)
/impeccable animate         # refine the postcard motion
/impeccable critique        # get a scored review before you ship
```

Tips:
- Tell `init` the users are art directors / brands booking a photographer on their phone — it designs for that job.
- Keep `DESIGN.md` in the repo; it locks the cream/ink/rust palette and the three fonts so later work stays on-brand.
- Turn on the design hook so it flags slop while you (or an agent) edit.

## 3. The standout feature that's already built: **The Desk**

`components/PostcardWall.tsx` — a corkboard of postcards you can drag, toss and flip.
Grabbing lifts and tilts the card; letting go lands it with spring physics; clicking flips it
to reveal a handwritten note from the shoot. Whatever you touch last comes to the front.

## 4. Other "pop" ideas, ranked by effort

1. **Darkroom scroll reveal** — photos start as a washed, blurred negative and "develop" into
   full color as they enter the viewport (Framer `useScroll` + CSS filter). Very on-brand for film-look work. ~2 hrs.
2. **Shoot map** — a stylized map with pins (Miami, Valletta, Tenerife, Nantucket); tap a pin and its postcards fan out. Use `react-simple-maps`. ~half day.
3. **Aperture cursor** — custom cursor that's a lens ring; it dilates over images and "shutters" on click with a quick white flash. ~1 hr, desktop only.
4. **Contact sheet mode** — a toggle that turns the site into a film contact sheet with red grease-pencil circles on the selects; click a frame to open it. ~half day.
5. **Light leak on hover** — a warm gradient that follows the pointer across each photo like a film light leak. ~1 hr.

If you want one thing beyond The Desk, do #1 — it makes every photo an event, not just the wall.
