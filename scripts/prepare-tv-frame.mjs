/**
 * Produce the Movie Night TV assets from the original photo
 * (public/tv/tv-frame-original.png, 2048×2048):
 *
 *   public/tv/tv-frame.webp / .png — cabinet crop with the screen glass
 *     punched to transparency. The hole is traced row-by-row from the
 *     photo's actual dark-glass runs, so it follows the barrel-curved
 *     CRT shape exactly, inset a little so the bezel shadow overlaps
 *     the video underneath.
 *   public/tv/tv-dial.webp / .png — circular cutout of the channel dial
 *     (red pointer included) that the component rotates over the frame.
 *
 * Prints the geometry constants (as % of the crop) used in MovieNight.tsx.
 * Run: node scripts/prepare-tv-frame.mjs
 */
import fs from "node:fs";
import sharp from "sharp";

const ORIGINAL = "public/tv/tv-frame-original.png";
if (!fs.existsSync(ORIGINAL)) {
  fs.copyFileSync("public/tv/tv-frame.png", ORIGINAL);
  console.log("saved untouched original →", ORIGINAL);
}

const { data, info } = await sharp(ORIGINAL)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const lum = (x, y) => {
  const i = (y * W + x) * C;
  return 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
};

// --- geometry measured from the photo (original 2048-px coordinates) ---
const CROP = { left: 48, top: 244, width: 1948, height: 1588 };
const DIAL = { cx: 1802, cy: 570, r: 104 };
const BUTTONS = [
  { x0: 1750, y0: 742, x1: 1840, y1: 812 },
  { x0: 1750, y0: 845, x1: 1840, y1: 912 },
  { x0: 1750, y0: 945, x1: 1840, y1: 1015 },
  { x0: 1750, y0: 1063, x1: 1840, y1: 1130 },
];
const POWER = { x0: 1735, y0: 1228, x1: 1852, y1: 1335 };
const POWER_LENS = { x0: 1759, y0: 1254, x1: 1825, y1: 1304 };

// --- the screen hole: hand-read from a brightened, gridded view of the
//     glass (scripts history: glare defeats threshold tracing, so the
//     outline is authored as a path in original-pixel coordinates and
//     already sits ~8px inside the glass edge so the bezel shadow always
//     overlaps the video underneath) ---
const HOLE_PATH = [
  "M 233 570",
  "C 235 455 300 385 430 373", // top-left corner
  "L 1360 373",
  "C 1470 378 1545 450 1550 570", // top-right corner
  "C 1556 800 1556 1050 1550 1220", // right edge (slight barrel bulge)
  "C 1548 1300 1480 1380 1360 1392", // bottom-right corner
  "C 1050 1400 750 1400 430 1392", // bottom edge (slight bow)
  "C 300 1382 237 1300 233 1150", // bottom-left corner
  "C 225 1000 225 760 233 570", // left edge (slight barrel bulge)
  "Z",
].join(" ");

const holeSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${CROP.width}" height="${CROP.height}">
     <path d="${HOLE_PATH}" transform="translate(${-CROP.left} ${-CROP.top})" fill="#fff"/>
   </svg>`
);
const holeMask = await sharp(holeSvg)
  .resize(CROP.width, CROP.height)
  .ensureAlpha()
  .extractChannel(3)
  .raw()
  .toBuffer();

// punch the hole straight into the cropped image's alpha channel (the
// 1600px downscale anti-aliases the edge)
const croppedRaw = await sharp(ORIGINAL)
  .extract(CROP)
  .ensureAlpha()
  .raw()
  .toBuffer();
let hx0 = Infinity, hx1 = -Infinity, hy0 = Infinity, hy1 = -Infinity;
for (let i = 0; i < holeMask.length; i++) {
  const m = holeMask[i];
  if (m === 0) continue;
  croppedRaw[i * 4 + 3] = Math.min(croppedRaw[i * 4 + 3], 255 - m);
  if (m > 127) {
    const x = (i % CROP.width) + CROP.left;
    const y = Math.floor(i / CROP.width) + CROP.top;
    if (x < hx0) hx0 = x;
    if (x > hx1) hx1 = x;
    if (y < hy0) hy0 = y;
    if (y > hy1) hy1 = y;
  }
}
console.log(`hole bbox (orig px): x ${hx0}..${hx1}  y ${hy0}..${hy1}`);

const punched = await sharp(croppedRaw, {
  raw: { width: CROP.width, height: CROP.height, channels: 4 },
})
  .png()
  .toBuffer();

const OUT_W = 1600;
await sharp(punched).resize(OUT_W).webp({ quality: 82, alphaQuality: 90 }).toFile("public/tv/tv-frame.webp");
await sharp(punched).resize(OUT_W).png({ compressionLevel: 9 }).toFile("public/tv/tv-frame.png");

// --- dial cutout: circle a hair inside the knob edge, transparent outside ---
const dR = DIAL.r - 2;
const dBox = { left: DIAL.cx - DIAL.r, top: DIAL.cy - DIAL.r, width: DIAL.r * 2, height: DIAL.r * 2 };
const circle = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${dBox.width}" height="${dBox.height}">
     <circle cx="${DIAL.r}" cy="${DIAL.r}" r="${dR}" fill="#fff"/>
   </svg>`
);
const dialCut = await sharp(ORIGINAL)
  .extract(dBox)
  .ensureAlpha()
  .composite([{ input: circle, top: 0, left: 0, blend: "dest-in" }])
  .png()
  .toBuffer();
await sharp(dialCut).webp({ quality: 85 }).toFile("public/tv/tv-dial.webp");
await sharp(dialCut).png().toFile("public/tv/tv-dial.png");

// --- verification composite: crop over magenta so the hole reads clearly ---
const check = await sharp({
  create: { width: CROP.width, height: CROP.height, channels: 3, background: "#ff00ff" },
})
  .composite([{ input: punched, top: 0, left: 0 }])
  .png()
  .toBuffer();
await sharp(check).resize(1024).png().toFile(process.env.CHECK_OUT ?? "/tmp/tv-hole-check.png");

// --- component constants, % of the crop ---
const pct = (v, total) => +((v / total) * 100).toFixed(2);
const rel = ({ x0, y0, x1, y1 }) => ({
  left: pct(x0 - CROP.left, CROP.width),
  top: pct(y0 - CROP.top, CROP.height),
  width: pct(x1 - x0, CROP.width),
  height: pct(y1 - y0, CROP.height),
});
console.log(
  JSON.stringify(
    {
      aspect: `${CROP.width} / ${CROP.height}`,
      screen: rel({ x0: hx0, y0: hy0, x1: hx1, y1: hy1 }),
      dial: rel({ x0: DIAL.cx - DIAL.r, y0: DIAL.cy - DIAL.r, x1: DIAL.cx + DIAL.r, y1: DIAL.cy + DIAL.r }),
      buttons: BUTTONS.map(rel),
      power: rel(POWER),
      powerLens: rel(POWER_LENS),
    },
    null,
    2
  )
);
