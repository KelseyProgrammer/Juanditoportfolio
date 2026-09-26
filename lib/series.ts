import { gallery, type GalleryPhoto } from "@/lib/photos";
import { videos, type Video } from "@/lib/videos";

/**
 * Series — the Darkroom's shoots, derived from gallery captions.
 *
 * The gallery array in photos.ts stays untouched; everything series-shaped
 * lives in the SERIES record below. A caption missing from the record still
 * becomes a series automatically (slugified caption, first frame as hero),
 * so new photos never break the grid.
 */

export type SeriesMeta = {
  slug: string;      // url-safe id, used in ?series=<slug>
  title?: string;    // display name; defaults to the caption
  hero?: string;     // src of the hero frame; defaults to the series' first frame
};

// THE one editable record, keyed by gallery caption.
// - Swap a hero: change its `hero:` to any src in that series.
// - Merge captions into one series: give them the same slug (see Journal).
// - Rename a series: set `title`.
export const SERIES: Record<string, SeriesMeta> = {
  // Named shoots — heroes follow the client's Desk / hero-pile picks.
  "Annie": { slug: "annie", hero: "/photos/annie-01.jpg" },
  "Bradley Theodore": { slug: "bradley-theodore", hero: "/photos/bradleytheodore03.jpg" },
  "Gracie": { slug: "gracie" },
  "Maile": { slug: "maile", hero: "/photos/maile0402.jpg" },
  "NVL": { slug: "nvl" },
  "Oleta — Nikki": { slug: "oleta-nikki", hero: "/photos/oletanikki-016-copy.jpg" },
  "SS23 Heritage Sport": { slug: "ss23-heritage-sport", hero: "/photos/ss23-heritage-sport1979.jpg" },
  "Watababe Editorial": { slug: "watababe-editorial", hero: "/photos/watababe-editorial-21.jpg" },
  "Zan": { slug: "zan", hero: "/photos/zan-03.jpg" },

  // The journal — every dated camera-roll bucket folds into one series.
  "Journal · Feb 2020": { slug: "journal", title: "Journal" },
  "Journal · Sep 2022": { slug: "journal" },
  "Journal · Jun 2024": { slug: "journal" },
  "Journal · Dec 2024": { slug: "journal" },
  "Journal · Feb 2025": { slug: "journal" },
  "Journal · Nov 2025": { slug: "journal", hero: "/photos/photo-nov-06-2025-10-37-54-am.jpg" },
  "Journal · Jan 2026": { slug: "journal" },
  "Journal · Feb 2026": { slug: "journal" },
  "Journal · Sep 2026": { slug: "journal" },
};

export type PhotoFrame = {
  kind: "photo";
  photo: GalleryPhoto;
  globalIndex: number; // position in `gallery` — the source of FR numbers
};

export type VideoFrame = {
  kind: "video";
  video: Video;
  videoIndex: number; // position in `videos` — the source of MOV numbers
};

export type SeriesFrame = PhotoFrame | VideoFrame;

export type Series = {
  slug: string;
  title: string;
  hero: PhotoFrame;      // always a still — video heroes are deferred
  frames: SeriesFrame[]; // gallery order, then the series' clips
  captions: string[];    // source captions folded into this series
};

function slugify(caption: string): string {
  return caption
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSeries(): Series[] {
  const bySlug = new Map<string, { photos: PhotoFrame[]; captions: string[] }>();

  gallery.forEach((photo, globalIndex) => {
    const slug = SERIES[photo.caption]?.slug ?? slugify(photo.caption);
    let group = bySlug.get(slug);
    if (!group) {
      group = { photos: [], captions: [] };
      bySlug.set(slug, group);
    }
    group.photos.push({ kind: "photo", photo, globalIndex });
    if (!group.captions.includes(photo.caption)) group.captions.push(photo.caption);
  });

  // Clips append to the end of their series' strip, in videos-array order.
  const videosBySlug = new Map<string, VideoFrame[]>();
  videos.forEach((video, videoIndex) => {
    if (!bySlug.has(video.series)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[series] video "${video.playbackId}" names unknown series "${video.series}" — skipped`);
      }
      return;
    }
    const list = videosBySlug.get(video.series) ?? [];
    list.push({ kind: "video", video, videoIndex });
    videosBySlug.set(video.series, list);
  });

  return Array.from(bySlug.entries()).map(([slug, { photos, captions }]) => {
    const metas = captions
      .map((caption) => SERIES[caption])
      .filter((meta): meta is SeriesMeta => Boolean(meta));

    const heroSrc = metas.find((meta) => meta.hero)?.hero;
    let hero = photos[0];
    if (heroSrc) {
      const match = photos.find((frame) => frame.photo.src === heroSrc);
      if (match) {
        hero = match;
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(`[series] hero "${heroSrc}" is not a frame of "${slug}" — using first frame`);
      }
    }

    return {
      slug,
      title: metas.find((meta) => meta.title)?.title ?? captions[0],
      hero,
      frames: [...photos, ...(videosBySlug.get(slug) ?? [])],
      captions,
    };
  });
}

export const seriesList: Series[] = buildSeries();
export const seriesBySlug = new Map(seriesList.map((s) => [s.slug, s]));
