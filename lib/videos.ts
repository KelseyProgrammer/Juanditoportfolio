/**
 * Videos — the Movie Night channel lineup, hosted on Mux.
 *
 * Channels for Movie Night (components/MovieNight.tsx), in channel order —
 * CH 01 is index 0. A clip with a `series` slug ALSO rides that series'
 * film strip as a MOV frame, labeled MOV 01, MOV 02, … in array order.
 * See docs/VIDEO.md for the runbook.
 */

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

export const videos: Video[] = [
  { playbackId: "1x4SJ5h00d9YCottD7y7NRTuBZlZ3iXe4Exx77iJ7cf00", title: "Find the Light", alt: "A model in a wide-brimmed straw hat tied with a peach ribbon closes her eyes in the sun against a deep blue sky", w: 16, h: 9, duration: 92 },
  { playbackId: "ZffZ234XJ02957n3zaMipjiYRh2lTncncYutMmMFIZRg", title: "Maile", alt: "Maile smiles against a wooden fence in a snakeskin-print dress, pink daisies double-exposed over the frame", w: 16, h: 9, duration: 59, series: "maile" },
  { playbackId: "QcMX7jfeIAcPl4qBYIJj0001uRhECtqmrLLc6lsJfjZfk", title: "Fiorella", alt: "A model lounges in a wooden garden chair wearing a pastel sunset-knit cardigan and tie-dye pants, sunlit lawn behind her", w: 16, h: 9, duration: 61 },
  { playbackId: "4AkVYlgDN4REGCgmjh3hKZwGYoy6lcSI7JdWs3Bmfas", title: "Brent Neale Ocean", alt: "Hands stacked with gemstone rings rest on a sheer peach dress among coastal rocks", w: 16, h: 9, duration: 49 },
  { playbackId: "s013cK018DiYMcMJ2HfrS7jz4da19o009vGOdM2vIRhLJE", title: "Veronica Beard Summer 26", alt: "A model in a black mini dress leans on a white seaside terrace beside an orange telescope viewer, the ocean behind her", w: 16, h: 9, duration: 25 },
  { playbackId: "u3SuzN7COexl8SEr6Bd1wPlczzWeXVZpfaaIM0100dn8c", title: "Lilly Pulitzer", alt: "A model in a fruit-appliqué cardigan and orange skirt strolls a produce market past crates of guavas and oranges", w: 9, h: 16, duration: 30 },
  { playbackId: "TMkZXPTggNIoGiAR6UYltjoidcHdk3IuwvryUDCjXCc", title: "Dilara", alt: "A model turns beneath billowing sheer peach fabric against a pale cream sky, palm fronds soft behind her", w: 256, h: 135, duration: 82 },
  { playbackId: "oTJ537mPs9h6nKWOmGO02BMNvBwvjn1kFD2P5XbgsDGY", title: "CARACARA NYC", alt: "A braided bridle and green lead rope hang from a white pasture fence, hills soft in the distance", w: 9, h: 16, duration: 34, posterTime: 10 },
  { playbackId: "aW7OLKOaYPWaASUUhq0100k5SawhZcqPv9iS8WMKeXb64", title: "BC Surf and Sport", alt: "A tattooed surfer in a tie-dye bikini carries her board along the shore by a weathered pier", w: 9, h: 16, duration: 50 },
  { playbackId: "SEI128cL8QK87TOVAoOxN9TO8MF4Ou73Dps8bdcbGyM", title: "West Palm Beach Magazine", alt: "Sun falls across a navy Honey Fitz presidential-yacht pillow on a deck chair aboard the yacht", w: 9, h: 16, duration: 104 },
];

/**
 * Mux environment key — public, enables playback analytics (Mux Data).
 * This is NOT the API access token; ingestion needs MUX_TOKEN_ID +
 * MUX_TOKEN_SECRET in the shell (never committed).
 */
export const MUX_ENV_KEY = "3rclipmvit6nptb9shbp02en7";

/** Poster frame served straight from Mux (no upload needed). */
export const muxPoster = (playbackId: string, width = 1200, time?: number) =>
  `https://image.mux.com/${playbackId}/thumbnail.jpg?width=${width}${time !== undefined ? `&time=${time}` : ""}`;

/** 47 → "0:47", 143 → "2:23" */
export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};
