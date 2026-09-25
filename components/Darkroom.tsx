"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { gallery, type GalleryPhoto } from "@/lib/photos";

/**
 * The Darkroom — every frame in the archive, developed on entry.
 * Each print arrives as a washed, blurred negative under a red safelight
 * and pours into full color once it enters the viewport.
 *
 * Performance notes, hard-won:
 * - The develop is a one-shot CSS animation ending on `filter: none`, so
 *   no print keeps a GPU layer after developing; the safelight overlay
 *   (a mix-blend layer) is removed from the DOM when the pour finishes.
 * - `content-visibility: auto` lets the browser skip rendering prints
 *   far offscreen.
 * - The masonry is real flex columns balanced by aspect ratio, not CSS
 *   multicol: IntersectionObserver mis-reports element rects at column
 *   fragment boundaries, which left the first print of each CSS column
 *   stuck as a negative.
 */

function DarkroomPrint({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  const animating = !reduceMotion && !done;
  const frame = String(index + 1).padStart(3, "0");

  return (
    <figure
      ref={ref}
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 520px" }}
    >
      <div className="bg-[#FBF6EC] p-2 pb-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <div
          className={`relative overflow-hidden bg-black ${
            animating ? (inView ? "print-develop" : "print-negative") : ""
          }`}
          onAnimationEnd={() => setDone(true)}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.w}
            height={photo.h}
            sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 30vw"
            draggable={false}
            className="block h-auto w-full"
          />
          {animating && (
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 bg-[#E5301F] mix-blend-multiply ${
                inView ? "safelight-off" : "opacity-45"
              }`}
            />
          )}
        </div>
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between font-stamp text-[11px] uppercase tracking-[0.18em]">
        <span className="text-[#F1E8D6]/70">{photo.caption}</span>
        <span className="text-[#E5301F]/80">FR {frame}</span>
      </figcaption>
    </figure>
  );
}

type Placed = { photo: GalleryPhoto; index: number };

/** Greedy shortest-column balance using each print's aspect ratio. */
function distribute(photos: GalleryPhoto[], cols: number): Placed[][] {
  const buckets: Placed[][] = Array.from({ length: cols }, () => []);
  const heights = Array(cols).fill(0);
  photos.forEach((photo, index) => {
    const k = heights.indexOf(Math.min(...heights));
    buckets[k].push({ photo, index });
    heights[k] += photo.h / photo.w;
  });
  return buckets;
}

export default function Darkroom() {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const queries = [
      window.matchMedia("(min-width: 1280px)"),
      window.matchMedia("(min-width: 640px)")
    ];
    const update = () => setCols(queries[0].matches ? 3 : queries[1].matches ? 2 : 1);
    update();
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  const columns = useMemo(() => distribute(gallery, cols), [cols]);

  return (
    <section id="darkroom" className="border-t-2 border-ink bg-[#191410] px-6 py-16 md:px-14">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl text-[#F1E8D6] md:text-4xl">The Darkroom</h2>
        <p className="font-stamp text-xs uppercase tracking-widest text-[#E5301F]">
          Scroll to develop · {gallery.length} frames
        </p>
      </div>

      <div className="flex gap-5 md:gap-7">
        {columns.map((column, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-5 md:gap-7">
            {column.map(({ photo, index }) => (
              <DarkroomPrint key={photo.src} photo={photo} index={index} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
