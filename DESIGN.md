---
name: Juandito — Sun Journal
description: A photographer's sun journal — postcards, postmarks, and prints developed on the road.
colors:
  paper: "#F1E8D6"
  postcard-cream: "#FBF6EC"
  corkboard: "#E6D9C0"
  ink: "#2E2620"
  inkfaint: "#5C5245"
  rust: "#B0522E"
  sand: "#C98A4A"
  olive: "#5C7A4F"
  darkroom: "#191410"
  safelight: "#E5301F"
typography:
  display:
    fontFamily: "Rock Salt, cursive"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.7
  stamp:
    fontFamily: "Special Elite, Courier New, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.18em"
  body:
    fontFamily: "Work Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  none: "0px"
  full: "9999px"
spacing:
  xs: "12px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  section-x: "56px"
  section-y: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.paper}"
  button-backtotop:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "48px"
  postcard:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.none}"
    padding: "12px 12px 32px"
---

# Design System: Juandito — Sun Journal

## Overview

**Creative North Star: "The Sun Journal"**

The site is a photographer's travel journal kept in Miami light: a desk of handled
postcards, a wall of prints developed on the road, everything resting on warm,
sun-bleached paper. Nothing on screen is "UI chrome" if it can be a physical
artifact instead — headings are hand-lettered in rough brush caps, labels are
struck with a typewriter, accents are rubber-stamped in postmark rust, and
photographs arrive as paper objects with weight, tilt, and shadow. The interface recedes; the
archive is the argument.

Interactive elements lean **playful scrapbook**: things tilt at imperfect
angles, lift when grabbed, land with spring physics, and carry marks of
handling — postmarks, frame numbers, handwritten notes on postcard backs.
The one deliberate inversion is The Darkroom: a single near-black room inside
the paper world where prints develop under a safelight red.

**Key Characteristics:**
- Warm paper surfaces; color temperature never goes cool
- Photography presented as physical prints and postcards, never as bare rectangles
- Typewriter labels (uppercase, letterspaced) as the system's official "stamp" voice
- Imperfect rotation (±1.5–6°) on every paper artifact
- One dark section (The Darkroom) as the counterweight to an otherwise cream site

## Colors

A sun-warmed paper palette struck with rubber-stamp rust, inverting once into darkroom black and safelight red.

### Primary
- **Postmark Rust** (#B0522E): The single accent. Ink from a rubber stamp — eyebrows, stamp labels, hover states, the postmark, text selection, focus rings. It marks small official moments; it never fills large surfaces.

### Neutral
- **Sun-Bleached Paper** (#F1E8D6): The page itself. Every light section sits directly on it.
- **Postcard Cream** (#FBF6EC): The backs of postcards and the paper mat around darkroom prints — one step brighter than the page, reads as "fresh paper."
- **Corkboard** (#E6D9C0): The Desk's pinboard surface, textured with a 18px dot grid.
- **Warm Ink** (#2E2620): All primary text, section borders, and the primary button. Never pure black.
- **Faded Caption** (#5C5245): Secondary text — bios, captions, hints.
- **Pure White** (#FFFFFF): Reserved exclusively for postcard fronts (the photo mat).

### Tertiary
- **Golden Hour Sand** (#C98A4A): Image-loading tint behind photos (used at 30% opacity).
- **Palm Olive** (#5C7A4F): Defined but currently unused; reserved for a future accent. Do not introduce it casually.

### The Darkroom pair
- **Darkroom Black** (#191410): The only dark surface on the site — warm, brown-cast black, never neutral gray-black.
- **Safelight Red** (#E5301F): Lives only inside the darkroom: the developing wash over negatives, frame numbers, and the section's stamp labels.

### Named Rules
**The Postmark Rule.** Rust is stamped, not painted: it appears on ≤10% of any screen, always on small marks (labels, numbers, hovers, rings) and never as a background fill.

**The One Dark Room Rule.** Darkroom Black and Safelight Red exist only inside `#darkroom`. Every other surface lives on paper.

## Typography

**Display Font:** Rock Salt (with cursive fallback; single 400 weight)
**Body Font:** Work Sans (with system-ui, sans-serif)
**Label/Mono Font:** Special Elite (with Courier New, monospace)

**Character:** Rough hand-lettered brush caps do the talking — dry, gritty stroke edges that read as faded marker on paper, but stay fully legible — a typewriter does the labeling, and a quiet workhorse sans explains. Rock Salt runs wide and caps-only in feel, so display sizes stay moderate (≤2.25rem) with generous 1.7 leading. Special Elite brings the analog, hand-struck texture that makes labels feel stamped rather than typeset.

### Hierarchy
- **Display** (400, clamp ~1.875rem→2.75rem, line-height 1.6–1.7): Hero headline and section-scale statements. Generous leading for the rough caps; hard line breaks only ≥640px. Headings render at 75% of their surface's text color (ink/75 on paper, cream/75 in the darkroom) for a sun-faded read; body text stays full-strength.
- **Headline** (400, 1.875–3rem, snug): Section titles ("The Desk", "The Darkroom") and postcard-back notes.
- **Stamp** (400, 11–13px, letter-spacing 0.14–0.2em, UPPERCASE): Nav links, eyebrows, captions, frame numbers, hints. Always uppercase, always letterspaced, almost always rust or faded.
- **Body** (400, 16px, line-height 1.625): Bios and supporting prose, max-width ~36rem.

### Named Rules
**The Three Voices Rule.** Handwriting speaks, typewriter stamps, sans explains. Never a fourth face; never one voice doing another's job (no handwritten captions in the stamp role, no typewriter paragraphs).

## Layout

Full-bleed single-page scroll. Sections stack edge-to-edge, separated by 2px Warm Ink rules (`border-t-2`) rather than whitespace alone — the page reads as a continuous journal with ruled divisions. Horizontal padding is 24px on mobile and 56px from `md` up; sections breathe with ~64px vertical padding.

Inside sections, layout is flex-wrap with pixel bases (420px text columns, 320px image columns) that collapse gracefully on phones (`min-w-0` guards on flex children). The Desk is a bounded 780–900px corkboard with absolutely-positioned draggable cards. The Darkroom is a 1/2/3-column masonry built from real flex columns balanced by aspect ratio (breakpoints 640px and 1280px) — never CSS multicol, which breaks IntersectionObserver at column boundaries.

Spacing rhythm: 12 / 16 / 20–28 / 48–56px steps. Related items sit tight (12–16px); distinct groups separate generously (48px+).

## Elevation & Depth

**Paper lifted off a desk.** Shadows belong exclusively to paper artifacts — postcards, prints — and read as soft, warm, downward-offset casts from physical objects. UI chrome (nav, sections, text) is flat and separated by ruled borders instead. Depth increases only when paper is handled: grabbing a card deepens and drops its shadow as it "lifts."

### Shadow Vocabulary
- **Postcard at rest** (`box-shadow: 0 12px 28px rgba(46,38,32,0.18)`): Default for any paper object on a light surface. Warm ink-tinted, never gray.
- **Postcard lifted** (`box-shadow: 0 30px 50px rgba(46,38,32,0.3)`): While dragging; paired with scale 1.04 and doubled tilt.
- **Print in the dark** (`box-shadow: 0 16px 40px rgba(0,0,0,0.5)`): Darkroom prints against Darkroom Black.

### Named Rules
**The Paper Casts, Chrome Doesn't Rule.** If it isn't paper, it doesn't get a shadow. Sections divide with 2px ink rules, not elevation.

## Shapes

Paper has corners: border-radius is 0 on everything made of paper or ink — postcards, prints, buttons, sections, images. The only curves in the system are perfect circles (the postmark rings, the back-to-top button) and the hand-drawn wavy cancellation lines. Paper objects are always slightly rotated (±1.5° at rest, up to ±6° for decorative marks); perfectly square placement is reserved for the darkroom masonry, where prints hang straight.

**The No-Radius Rule.** Never `rounded-md` softening. A corner is sharp (0px) or a perfect circle (9999px); nothing in between.

## Components

### Buttons
- **Shape:** Sharp rectangle (0px radius)
- **Primary** (email CTA): Warm Ink fill, Sun-Bleached Paper text (16px/24px padding, 14px tracked text); hover swaps fill to Postmark Rust with a color transition
- **Text/stamp links** (nav, Instagram): Special Elite uppercase; default ink or rust, hover shifts to rust or underlines
- **Back to top:** 48px circle, paper fill, 2px ink border, postcard shadow; hover inverts to ink fill/paper arrow; enters and exits with a spring fade-rise past 700px scroll

### Cards / Containers (Postcard — signature component)
- **Corner Style:** Sharp (0px)
- **Front:** Pure White mat, 12px padding with a 32px bottom lip, 2:3 photo window — the archive's native frame, so portraits crop little or not at all (`object-position: 50% 20%` guards the rest), Special Elite caption centered in the lip
- **Back:** Postcard Cream, "POST CARD" stamp header in rust, note written in the display hand, and a dashed stamp box holding a lightning bolt outline (hand-drawn SVG stroke in rust); revealed by a 3D Y-flip (spring 260/26)
- **Behavior:** Rests tilted; drags with momentum inside the corkboard; grabbing lifts (see Elevation); a true tap flips, a drag never does

### Darkroom Print (signature component)
- Postcard Cream mat (8px), photo at native aspect, deep dark shadow
- Arrives as a blurred inverted negative under a 45% Safelight Red multiply wash; develops once on viewport entry — a single 1.4s ease-out pour (`cubic-bezier(0.22,1,0.36,1)`) to full color, honoring `prefers-reduced-motion`. Implemented as a one-shot CSS animation ending on `filter: none` with the overlay removed after the pour, so no print retains a compositor layer; figures use `content-visibility: auto`
- Caption row: shoot name (paper 70%) left, "FR ###" frame number (safelight 80%) right, Special Elite 11px

### Navigation
- Flat paper bar, 2px ink bottom rule; handwritten wordmark left (reads as a signature), Special Elite uppercase links right (hover: rust); wraps to a second row under 640px — no hamburger

### Contact Sheet (the Darkroom's working mode)
- A Prints / Contact Sheet toggle in the Darkroom header (active state: paper fill for Prints, safelight fill for Contact Sheet)
- Sheet mode is a dense uniform grid (3→8 columns) of square thumbs on darkroom black, each with a tiny frame number — no develop theatrics; it exists for fast scanning
- Selects (frames featured on the Desk or in the hero pile, from `selects` in lib/photos.ts) carry a rough red grease-pencil ellipse
- Any frame opens in a lightbox: print on cream mat, caption + "· select" + FR number, Prev/Next/Close controls plus arrow-key and Escape support, background scroll locked
- Mode switches hide rather than unmount, so developed prints stay developed

### Aperture Cursor (signature interaction, desktop only)
- On fine-pointer devices the native cursor is replaced by a 2px rust lens ring (30px) with a center dot, gliding on a tight spring
- Over links it grows to 44px; over photographs it dilates to 56px and shows four viewfinder focus ticks
- Clicking fires the shutter: an ink iris blinks inside the ring, and clicks on photographs add a 200ms white flash
- Added only after JS mounts (`.aperture-active` on the root), so the native cursor survives without JS; touch devices never see it

### The Postmark (signature mark)
- Hand-drawn SVG: double-ring circle ("MIAMI, FLA / PAR AVION / USA") with three wavy cancellation bars, in rust, rotated -6°; scales 150→200px. Pairs with stamp-voice eyebrow text.

## Do's and Don'ts

### Do:
- **Do** put every photograph on paper — a white or cream mat with a caption — never a borderless image block.
- **Do** tilt paper artifacts (±1.5–6°) and let interactions use spring physics (stiffness 120–260, damping 16–26); lean playful — stamps, marks, handwriting are welcome.
- **Do** keep the stamp voice uppercase and letterspaced (≥0.14em) for every label, and rust for official marks.
- **Do** theme browser surfaces: rust `::selection`, rust `:focus-visible` (2px, 3px offset).
- **Do** guard flex columns with `min-w-0` and give masonry real flex columns with balanced heights.

### Don't:
- **Don't** use pure black, cool grays, or pure white anywhere except postcard fronts (#FFFFFF) — every neutral is warm.
- **Don't** round a corner (except perfect circles) or put a shadow on anything that isn't paper.
- **Don't** let rust exceed small-mark duty or leak safelight red outside the darkroom.
- **Don't** add a fourth typeface, gradient text, or icon fonts — icons are hand-drawn SVG strokes like the postmark.
- **Don't** fabricate captions, clients, or notes; every name traces to the real archive (see PRODUCT.md).
