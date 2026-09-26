export type Photo = {
  id: string;
  src: string;        // files live in /public/photos
  alt: string;
  caption: string;    // the postcard label, e.g. "Bradley Theodore"
  note?: string;      // handwritten note on the back of the postcard
  rotate: number;     // resting tilt in degrees
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  w: number;          // intrinsic pixel width of the export
  h: number;          // intrinsic pixel height of the export
};

// The hero mail pile — three postcards, kept separate from the Desk so no
// frame appears twice above the fold. Click a back print to bring it forward.
export const heroStack: Photo[] = [
  {
    id: "hero-annie",
    src: "/photos/annie-01.jpg",
    alt: "Annie, editorial portrait",
    caption: "Annie",
    note: "First frame after the rain stopped.",
    rotate: -3
  },
  {
    id: "hero-maile",
    src: "/photos/maile0203.jpg",
    alt: "Maile, editorial portrait",
    caption: "Maile",
    note: "Window light did most of the work.",
    rotate: -11
  },
  {
    id: "hero-corvette",
    src: "/photos/photo-nov-06-2025-10-37-54-am.jpg",
    alt: "Model with a pink Corvette, Miami",
    caption: "Journal · Nov 2025",
    note: "The car stole the scene. Let it.",
    rotate: 9
  }
];

// The Desk — six postcards. Swap picks, captions and notes freely;
// any src from the gallery below works here too.
export const photos: Photo[] = [
  { id: "zan", src: "/photos/zan-03.jpg", alt: "Portrait from the Zan shoot", caption: "Zan", note: "Last frame of the day. Always the keeper.", rotate: -1.5 },
  { id: "bradley", src: "/photos/bradleytheodore03.jpg", alt: "Bradley Theodore in the studio", caption: "Bradley Theodore", note: "Paint everywhere. Worth it.", rotate: 1.5 },
  { id: "maile", src: "/photos/maile0402.jpg", alt: "Maile, editorial portrait", caption: "Maile", note: "One light. No notes.", rotate: -1 },
  { id: "heritage", src: "/photos/ss23-heritage-sport1979.jpg", alt: "SS23 Heritage Sport campaign look", caption: "SS23 Heritage Sport", note: "Campaign day two. Sun cooperated.", rotate: 1 },
  { id: "watababe", src: "/photos/watababe-editorial-21.jpg", alt: "Watababe editorial frame", caption: "Watababe Editorial", note: "Styling did the heavy lifting here.", rotate: -2 },
  { id: "oleta", src: "/photos/oletanikki-016-copy.jpg", alt: "Nikki at Oleta River", caption: "Oleta — Nikki", note: "Golden hour at the river. Eaten alive by mosquitoes.", rotate: 1.5 }
];

// The photographer himself — the postcard in the contact footer.
export const contactPhoto: Photo = {
  id: "juandito",
  src: "/photos/juandito.jpg",
  alt: "Juandito in a BANDITO cap, reflected among string lights",
  caption: "Juandito Bandito",
  note: "The bandito himself. Wish you were here.",
  rotate: 2
};

// The selects — frames featured on the Desk and in the hero pile.
// These get the grease-pencil circle on the contact sheet.
export const selects = Array.from(
  new Set([...photos, ...heroStack].map((p) => p.src))
);

// The Darkroom — every frame in the archive, developed on scroll.
export const gallery: GalleryPhoto[] = [
  { src: "/photos/a7a5342.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1199, h: 1800 },
  { src: "/photos/2a7a8652.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1800, h: 1200 },
  { src: "/photos/2a7a8982.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1800, h: 1200 },
  { src: "/photos/2a7a8988.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1800, h: 1200 },
  { src: "/photos/2a7a9679.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1200, h: 1800 },
  { src: "/photos/2a7a9741.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1200, h: 1800 },
  { src: "/photos/812-011.jpg", alt: "Archive — photograph by Juandito", caption: "Archive", w: 1800, h: 1200 },
  { src: "/photos/alexis.jpg", alt: "Alexis — photograph by Juandito", caption: "Alexis", w: 1201, h: 1800 },
  { src: "/photos/annie-01.jpg", alt: "Annie — photograph by Juandito", caption: "Annie", w: 1271, h: 1800 },
  { src: "/photos/annie-05.jpg", alt: "Annie — photograph by Juandito", caption: "Annie", w: 1193, h: 1800 },
  { src: "/photos/annie-06.jpg", alt: "Annie — photograph by Juandito", caption: "Annie", w: 1800, h: 1200 },
  { src: "/photos/ashleykate03.jpg", alt: "Ashley Kate — photograph by Juandito", caption: "Ashley Kate", w: 1200, h: 1800 },
  { src: "/photos/blk-underware-005-copy.jpg", alt: "BLK Underware — photograph by Juandito", caption: "BLK Underware", w: 1800, h: 1200 },
  { src: "/photos/blk-underware-011-copy.jpg", alt: "BLK Underware — photograph by Juandito", caption: "BLK Underware", w: 1800, h: 1200 },
  { src: "/photos/bradleytheodore01.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1200, h: 1800 },
  { src: "/photos/bradleytheodore02.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1200, h: 1800 },
  { src: "/photos/bradleytheodore03.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1200, h: 1800 },
  { src: "/photos/bradleytheodore04.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1200, h: 1800 },
  { src: "/photos/bradleytheodore05.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1200, h: 1800 },
  { src: "/photos/bradleytheodore06.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1800, h: 1200 },
  { src: "/photos/bradleytheodore07.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1800, h: 1012 },
  { src: "/photos/bradleytheodore08.jpg", alt: "Bradley Theodore — photograph by Juandito", caption: "Bradley Theodore", w: 1200, h: 1800 },
  { src: "/photos/dee1.jpg", alt: "Dee — photograph by Juandito", caption: "Dee", w: 1200, h: 1800 },
  { src: "/photos/finnia-shot-11-06.jpg", alt: "Finnia — photograph by Juandito", caption: "Finnia", w: 1800, h: 1200 },
  { src: "/photos/finnia-shot-3-04.jpg", alt: "Finnia — photograph by Juandito", caption: "Finnia", w: 1800, h: 1200 },
  { src: "/photos/gracie01.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1200, h: 1800 },
  { src: "/photos/gracie02.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1200, h: 1800 },
  { src: "/photos/gracie03.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1200, h: 1800 },
  { src: "/photos/gracie04.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1199, h: 1800 },
  { src: "/photos/gracie06.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1199, h: 1800 },
  { src: "/photos/gracie07.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1800, h: 1200 },
  { src: "/photos/gracie08.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1200, h: 1800 },
  { src: "/photos/gracie09.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1800, h: 1168 },
  { src: "/photos/gracie10.jpg", alt: "Gracie — photograph by Juandito", caption: "Gracie", w: 1200, h: 1800 },
  { src: "/photos/jaredwc01.jpg", alt: "Jared — photograph by Juandito", caption: "Jared", w: 1800, h: 1200 },
  { src: "/photos/jaredwc02.jpg", alt: "Jared — photograph by Juandito", caption: "Jared", w: 1800, h: 1200 },
  { src: "/photos/jaredwc03.jpg", alt: "Jared — photograph by Juandito", caption: "Jared", w: 1800, h: 1200 },
  { src: "/photos/jbxnv24-shot-1-007.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1200, h: 1800 },
  { src: "/photos/jbxnv24-shot-2-006.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1200, h: 1800 },
  { src: "/photos/jbxnv24-shot-3-004.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1200, h: 1800 },
  { src: "/photos/jbxnv24-shot-3-005.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1200, h: 1800 },
  { src: "/photos/jbxnv24-shot-4-003.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1800, h: 1199 },
  { src: "/photos/jbxnv24-shot-5-002.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1200, h: 1800 },
  { src: "/photos/jbxnv24-shot-6-001.jpg", alt: "JBXNV24 — photograph by Juandito", caption: "JBXNV24", w: 1800, h: 1199 },
  { src: "/photos/joy01.jpg", alt: "Joy — photograph by Juandito", caption: "Joy", w: 1200, h: 1800 },
  { src: "/photos/joy02.jpg", alt: "Joy — photograph by Juandito", caption: "Joy", w: 1200, h: 1800 },
  { src: "/photos/joy03.jpg", alt: "Joy — photograph by Juandito", caption: "Joy", w: 1200, h: 1800 },
  { src: "/photos/joy04.jpg", alt: "Joy — photograph by Juandito", caption: "Joy", w: 1200, h: 1800 },
  { src: "/photos/joy05.jpg", alt: "Joy — photograph by Juandito", caption: "Joy", w: 1800, h: 1440 },
  { src: "/photos/look-0102.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1200, h: 1800 },
  { src: "/photos/look-0215.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1200, h: 1800 },
  { src: "/photos/look-0330.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1800, h: 1200 },
  { src: "/photos/look-0331.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1200, h: 1800 },
  { src: "/photos/look-04-29.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1800, h: 1200 },
  { src: "/photos/look-0437.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1200, h: 1800 },
  { src: "/photos/look-07-48.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1800, h: 1200 },
  { src: "/photos/look-07-49.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1200, h: 1800 },
  { src: "/photos/looky.jpg", alt: "Lookbook — photograph by Juandito", caption: "Lookbook", w: 1200, h: 1800 },
  { src: "/photos/maile0201.jpg", alt: "Maile — photograph by Juandito", caption: "Maile", w: 1200, h: 1800 },
  { src: "/photos/maile0202.jpg", alt: "Maile — photograph by Juandito", caption: "Maile", w: 1200, h: 1800 },
  { src: "/photos/maile0203.jpg", alt: "Maile — photograph by Juandito", caption: "Maile", w: 1278, h: 1800 },
  { src: "/photos/maile0402.jpg", alt: "Maile — photograph by Juandito", caption: "Maile", w: 1200, h: 1800 },
  { src: "/photos/maile0504.jpg", alt: "Maile — photograph by Juandito", caption: "Maile", w: 1800, h: 1200 },
  { src: "/photos/maile0703.jpg", alt: "Maile — photograph by Juandito", caption: "Maile", w: 1200, h: 1800 },
  { src: "/photos/new06-copy.jpg", alt: "New Work — photograph by Juandito", caption: "New Work", w: 1800, h: 1200 },
  { src: "/photos/new07-copy.jpg", alt: "New Work — photograph by Juandito", caption: "New Work", w: 1200, h: 1800 },
  { src: "/photos/new08-copy.jpg", alt: "New Work — photograph by Juandito", caption: "New Work", w: 1200, h: 1800 },
  { src: "/photos/new10-copy.jpg", alt: "New Work — photograph by Juandito", caption: "New Work", w: 1800, h: 1200 },
  { src: "/photos/new11-copy.jpg", alt: "New Work — photograph by Juandito", caption: "New Work", w: 1440, h: 1800 },
  { src: "/photos/nvl1-25.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1800, h: 1200 },
  { src: "/photos/nvl1-94.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1200, h: 1800 },
  { src: "/photos/nvl2-54.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1200, h: 1800 },
  { src: "/photos/nvl4-9.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1800, h: 1200 },
  { src: "/photos/nvl5-184.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1200, h: 1800 },
  { src: "/photos/nvl5-59.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1200, h: 1800 },
  { src: "/photos/nvl8-02.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1800, h: 1200 },
  { src: "/photos/nvl8-269.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1200, h: 1800 },
  { src: "/photos/nvl8-58.jpg", alt: "NVL — photograph by Juandito", caption: "NVL", w: 1200, h: 1800 },
  { src: "/photos/oletanikki-009.jpg", alt: "Oleta — Nikki — photograph by Juandito", caption: "Oleta — Nikki", w: 1200, h: 1800 },
  { src: "/photos/oletanikki-014-copy.jpg", alt: "Oleta — Nikki — photograph by Juandito", caption: "Oleta — Nikki", w: 1200, h: 1800 },
  { src: "/photos/oletanikki-016-copy.jpg", alt: "Oleta — Nikki — photograph by Juandito", caption: "Oleta — Nikki", w: 1200, h: 1800 },
  { src: "/photos/oletanikki-020-copy.jpg", alt: "Oleta — Nikki — photograph by Juandito", caption: "Oleta — Nikki", w: 1200, h: 1800 },
  { src: "/photos/oletanikki-030-copy.jpg", alt: "Oleta — Nikki — photograph by Juandito", caption: "Oleta — Nikki", w: 1800, h: 1200 },
  { src: "/photos/photo-dec-15-2024-4-06-26-pm.jpg", alt: "Journal · Dec 2024 — photograph by Juandito", caption: "Journal · Dec 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-dec-15-2024-4-08-57-pm.jpg", alt: "Journal · Dec 2024 — photograph by Juandito", caption: "Journal · Dec 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-dec-15-2024-4-23-34-pm.jpg", alt: "Journal · Dec 2024 — photograph by Juandito", caption: "Journal · Dec 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-dec-15-2024-4-24-10-pm.jpg", alt: "Journal · Dec 2024 — photograph by Juandito", caption: "Journal · Dec 2024", w: 1800, h: 1200 },
  { src: "/photos/photo-dec-15-2024-4-59-18-pm.jpg", alt: "Journal · Dec 2024 — photograph by Juandito", caption: "Journal · Dec 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-dec-15-2024-5-48-31-pm.jpg", alt: "Journal · Dec 2024 — photograph by Juandito", caption: "Journal · Dec 2024", w: 1800, h: 1200 },
  { src: "/photos/photo-feb-02-2026-12-45-23-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1800, h: 1200 },
  { src: "/photos/photo-feb-02-2026-2-17-51-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1800, h: 1200 },
  { src: "/photos/photo-feb-02-2026-4-20-29-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1285, h: 1800 },
  { src: "/photos/photo-feb-02-2026-4-27-50-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1800, h: 1200 },
  { src: "/photos/photo-feb-02-2026-4-35-18-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1200, h: 1800 },
  { src: "/photos/photo-feb-03-2026-3-58-58-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1200, h: 1800 },
  { src: "/photos/photo-feb-03-2026-4-17-46-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1800, h: 1200 },
  { src: "/photos/photo-feb-03-2026-4-24-59-pm.jpg", alt: "Journal · Feb 2026 — photograph by Juandito", caption: "Journal · Feb 2026", w: 1440, h: 1800 },
  { src: "/photos/photo-feb-06-2020-5-57-02-pm.jpg", alt: "Journal · Feb 2020 — photograph by Juandito", caption: "Journal · Feb 2020", w: 1800, h: 1200 },
  { src: "/photos/photo-feb-12-2025-10-51-15-am.jpg", alt: "Journal · Feb 2025 — photograph by Juandito", caption: "Journal · Feb 2025", w: 1440, h: 1800 },
  { src: "/photos/photo-feb-12-2025-10-51-16-am.jpg", alt: "Journal · Feb 2025 — photograph by Juandito", caption: "Journal · Feb 2025", w: 1200, h: 1800 },
  { src: "/photos/photo-feb-12-2025-10-51-46-am.jpg", alt: "Journal · Feb 2025 — photograph by Juandito", caption: "Journal · Feb 2025", w: 1200, h: 1800 },
  { src: "/photos/photo-feb-12-2025-11-56-27-am.jpg", alt: "Journal · Feb 2025 — photograph by Juandito", caption: "Journal · Feb 2025", w: 1200, h: 1800 },
  { src: "/photos/photo-feb-12-2025-6-39-03-pm.jpg", alt: "Journal · Feb 2025 — photograph by Juandito", caption: "Journal · Feb 2025", w: 1200, h: 1800 },
  { src: "/photos/photo-jan-04-2026-2-59-43-pm.jpg", alt: "Journal · Jan 2026 — photograph by Juandito", caption: "Journal · Jan 2026", w: 1200, h: 1800 },
  { src: "/photos/photo-jan-04-2026-3-06-16-pm.jpg", alt: "Journal · Jan 2026 — photograph by Juandito", caption: "Journal · Jan 2026", w: 1285, h: 1800 },
  { src: "/photos/photo-jun-26-2024-2-24-57-pm.jpg", alt: "Journal · Jun 2024 — photograph by Juandito", caption: "Journal · Jun 2024", w: 1800, h: 1200 },
  { src: "/photos/photo-jun-26-2024-2-26-13-pm.jpg", alt: "Journal · Jun 2024 — photograph by Juandito", caption: "Journal · Jun 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-jun-26-2024-4-32-15-pm.jpg", alt: "Journal · Jun 2024 — photograph by Juandito", caption: "Journal · Jun 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-jun-26-2024-4-33-51-pm.jpg", alt: "Journal · Jun 2024 — photograph by Juandito", caption: "Journal · Jun 2024", w: 1200, h: 1800 },
  { src: "/photos/photo-jun-26-2024-4-38-09-pm.jpg", alt: "Journal · Jun 2024 — photograph by Juandito", caption: "Journal · Jun 2024", w: 1800, h: 1200 },
  { src: "/photos/photo-nov-06-2025-10-09-02-am.jpg", alt: "Journal · Nov 2025 — photograph by Juandito", caption: "Journal · Nov 2025", w: 1200, h: 1800 },
  { src: "/photos/photo-nov-06-2025-10-26-49-am.jpg", alt: "Journal · Nov 2025 — photograph by Juandito", caption: "Journal · Nov 2025", w: 1800, h: 1200 },
  { src: "/photos/photo-nov-06-2025-10-37-54-am.jpg", alt: "Journal · Nov 2025 — photograph by Juandito", caption: "Journal · Nov 2025", w: 1286, h: 1800 },
  { src: "/photos/photo-nov-06-2025-9-33-38-am.jpg", alt: "Journal · Nov 2025 — photograph by Juandito", caption: "Journal · Nov 2025", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-06-2022-3-12-29-pm.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-06-2022-4-22-35-pm.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-06-2022-4-57-02-pm.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1271, h: 1800 },
  { src: "/photos/photo-sep-07-2022-10-31-09-am.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1800, h: 1200 },
  { src: "/photos/photo-sep-07-2022-10-33-48-am.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-07-2022-10-33-52-am.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-07-2022-10-35-05-am.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-07-2022-12-05-33-pm.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-07-2022-12-09-08-pm.jpg", alt: "Journal · Sep 2022 — photograph by Juandito", caption: "Journal · Sep 2022", w: 1200, h: 1800 },
  { src: "/photos/photo-sep-25-2026-2-10-59-am-1.jpg", alt: "Journal · Sep 2026 — photograph by Juandito", caption: "Journal · Sep 2026", w: 1800, h: 1193 },
  { src: "/photos/photo-sep-25-2026-2-10-59-am-2.jpg", alt: "Journal · Sep 2026 — photograph by Juandito", caption: "Journal · Sep 2026", w: 1800, h: 1193 },
  { src: "/photos/photo-sep-25-2026-2-10-59-am-3.jpg", alt: "Journal · Sep 2026 — photograph by Juandito", caption: "Journal · Sep 2026", w: 1800, h: 1193 },
  { src: "/photos/photo-sep-25-2026-2-10-59-am-4.jpg", alt: "Journal · Sep 2026 — photograph by Juandito", caption: "Journal · Sep 2026", w: 1800, h: 1193 },
  { src: "/photos/photo-sep-25-2026-2-10-59-am-5.jpg", alt: "Journal · Sep 2026 — photograph by Juandito", caption: "Journal · Sep 2026", w: 1800, h: 1193 },
  { src: "/photos/photo-sep-25-2026-2-10-59-am-6.jpg", alt: "Journal · Sep 2026 — photograph by Juandito", caption: "Journal · Sep 2026", w: 1800, h: 1193 },
  { src: "/photos/sebastian01.jpg", alt: "Sebastian — photograph by Juandito", caption: "Sebastian", w: 1282, h: 1800 },
  { src: "/photos/sebastian02.jpg", alt: "Sebastian — photograph by Juandito", caption: "Sebastian", w: 1200, h: 1800 },
  { src: "/photos/sebastian03.jpg", alt: "Sebastian — photograph by Juandito", caption: "Sebastian", w: 1200, h: 1800 },
  { src: "/photos/shakakai01.jpg", alt: "Shakakai — photograph by Juandito", caption: "Shakakai", w: 1200, h: 1800 },
  { src: "/photos/shakakai02.jpg", alt: "Shakakai — photograph by Juandito", caption: "Shakakai", w: 1200, h: 1800 },
  { src: "/photos/shakakai03.jpg", alt: "Shakakai — photograph by Juandito", caption: "Shakakai", w: 1800, h: 1199 },
  { src: "/photos/shakakai04.jpg", alt: "Shakakai — photograph by Juandito", caption: "Shakakai", w: 1200, h: 1800 },
  { src: "/photos/shot-11-07.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1200, h: 1800 },
  { src: "/photos/shot-01-01.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1200, h: 1800 },
  { src: "/photos/shot-02-05.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/shot-02-07.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/shot-02-4.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1200, h: 1800 },
  { src: "/photos/shot-02-5.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/shot-03-04.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1200, h: 1800 },
  { src: "/photos/shot-05-8.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/shot-06-4final.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/shot-08-1.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1200, h: 1800 },
  { src: "/photos/shot-08-4.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/shot-08.jpg", alt: "Editorial — photograph by Juandito", caption: "Editorial", w: 1800, h: 1200 },
  { src: "/photos/ss23-heritage-sport1873.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1800, h: 1200 },
  { src: "/photos/ss23-heritage-sport1979.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1200, h: 1800 },
  { src: "/photos/ss23-heritage-sport1998.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1200, h: 1800 },
  { src: "/photos/ss23-heritage-sport2008.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1800, h: 1200 },
  { src: "/photos/ss23-heritage-sport2045.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1200, h: 1800 },
  { src: "/photos/ss23-heritage-sport2078.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1200, h: 1800 },
  { src: "/photos/ss23-heritage-sport2162.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1800, h: 1200 },
  { src: "/photos/ss23-heritage-sport2204.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1800, h: 1200 },
  { src: "/photos/ss23-heritage-sport2214.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1800, h: 1200 },
  { src: "/photos/ss23-heritage-sport2259.jpg", alt: "SS23 Heritage Sport — photograph by Juandito", caption: "SS23 Heritage Sport", w: 1800, h: 1200 },
  { src: "/photos/watababe-editorial-21.jpg", alt: "Watababe Editorial — photograph by Juandito", caption: "Watababe Editorial", w: 1200, h: 1800 },
  { src: "/photos/watababe-editorial-23.jpg", alt: "Watababe Editorial — photograph by Juandito", caption: "Watababe Editorial", w: 1200, h: 1800 },
  { src: "/photos/watababe-editorial-25.jpg", alt: "Watababe Editorial — photograph by Juandito", caption: "Watababe Editorial", w: 1800, h: 1012 },
  { src: "/photos/watababe-editorial-26.jpg", alt: "Watababe Editorial — photograph by Juandito", caption: "Watababe Editorial", w: 1800, h: 1200 },
  { src: "/photos/zan-01.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1200, h: 1800 },
  { src: "/photos/zan-03.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1285, h: 1800 },
  { src: "/photos/zan-05.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1200, h: 1800 },
  { src: "/photos/zan-22.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1200, h: 1800 },
  { src: "/photos/zan-24.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1800, h: 1200 },
  { src: "/photos/zan-81.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1200, h: 1800 },
  { src: "/photos/zan-84.jpg", alt: "Zan — photograph by Juandito", caption: "Zan", w: 1200, h: 1800 },
];
