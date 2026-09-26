"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { gallery, selects, type GalleryPhoto } from "@/lib/photos";

/**
 * The Darkroom — every frame in the archive, in two modes:
 *
 * Prints (default): matted prints developed on entry — each arrives as a
 * washed, blurred negative under a red safelight and pours into color.
 *
 * Contact sheet: the working view. A dense uniform grid of all frames,
 * selects circled in grease pencil, any frame opening full-size in a
 * lightbox with arrow-key navigation. No develop theatrics — this mode
 * exists so an art director can scan the archive fast.
 *
 * Performance notes, hard-won:
 * - The develop is a one-shot CSS animation ending on `filter: none`, so
 *   no print keeps a GPU layer after developing; the safelight overlay
 *   (a mix-blend layer) is removed from the DOM when the pour finishes.
 * - `content-visibility: auto` lets the browser skip rendering frames
 *   far offscreen in both modes.
 * - The masonry is real flex columns balanced by aspect ratio, not CSS
 *   multicol: IntersectionObserver mis-reports element rects at column
 *   fragment boundaries, which left the first print of each CSS column
 *   stuck as a negative.
 * - Mode switches hide rather than unmount, so developed prints stay
 *   developed and the sheet never re-renders from scratch.
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

/** Rough open ellipse, like a grease pencil dragged around a keeper. */
function GreaseCircle() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-[4%] rotate-[-4deg]"
    >
      <path
        d="M52 9 C78 7 93 24 92 49 C91 76 70 93 46 92 C21 91 8 71 10 46 C12 24 30 10 58 12"
        fill="none"
        stroke="#E5301F"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
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

const selectSet = new Set(selects);

export default function Darkroom() {
  const [cols, setCols] = useState(3);
  const [mode, setMode] = useState<"prints" | "sheet">("prints");
  const [sheetMounted, setSheetMounted] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

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

  // Lightbox: lock scroll and handle Escape / arrow keys while open.
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft") setOpenIdx((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIdx]);

  const showSheet = (on: boolean) => {
    setMode(on ? "sheet" : "prints");
    if (on) setSheetMounted(true);
  };

  const columns = useMemo(() => distribute(gallery, cols), [cols]);
  const open = openIdx === null ? null : gallery[openIdx];

  const toggleBase =
    "px-3 py-1.5 font-stamp text-[11px] uppercase tracking-[0.18em] transition-colors";

  return (
    <section id="darkroom" className="border-t-2 border-ink bg-[#191410] px-6 py-16 md:px-14">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h2 className="font-display text-3xl text-[#F1E8D6]/75 md:text-4xl">The Darkroom</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="font-stamp text-xs uppercase tracking-widest text-[#E5301F]">
            {mode === "prints"
              ? `Scroll to develop · ${gallery.length} frames`
              : "Selects circled · tap any frame"}
          </p>
          <div className="flex border border-[#F1E8D6]/30">
            <button
              type="button"
              aria-pressed={mode === "prints"}
              onClick={() => showSheet(false)}
              className={`${toggleBase} ${
                mode === "prints"
                  ? "bg-[#F1E8D6] text-[#191410]"
                  : "text-[#F1E8D6]/60 hover:text-[#F1E8D6]"
              }`}
            >
              Prints
            </button>
            <button
              type="button"
              aria-pressed={mode === "sheet"}
              onClick={() => showSheet(true)}
              className={`${toggleBase} ${
                mode === "sheet"
                  ? "bg-[#E5301F] text-[#191410]"
                  : "text-[#F1E8D6]/60 hover:text-[#F1E8D6]"
              }`}
            >
              Contact Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Prints — the developing masonry */}
      <div className={mode === "prints" ? "flex gap-5 md:gap-7" : "hidden"}>
        {columns.map((column, c) => (
          <div key={c} className="flex min-w-0 flex-1 flex-col gap-5 md:gap-7">
            {column.map(({ photo, index }) => (
              <DarkroomPrint key={photo.src} photo={photo} index={index} />
            ))}
          </div>
        ))}
      </div>

      {/* Contact sheet — the working grid */}
      {sheetMounted && (
        <div
          className={
            mode === "sheet"
              ? "grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6 md:gap-2 xl:grid-cols-8"
              : "hidden"
          }
        >
          {gallery.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`Open frame ${i + 1} — ${photo.caption}`}
              className="group relative border border-[#F1E8D6]/10 bg-black"
              style={{ contentVisibility: "auto", containIntrinsicSize: "auto 150px" }}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 1280px) 17vw, 12vw"
                  draggable={false}
                  className="object-cover object-[50%_20%] transition-opacity group-hover:opacity-75"
                />
                {selectSet.has(photo.src) && <GreaseCircle />}
              </div>
              <div className="px-1 py-0.5 text-left font-stamp text-[9px] tracking-[0.12em] text-[#F1E8D6]/45">
                {String(i + 1).padStart(3, "0")}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {open && openIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-[#191410]/95 p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpenIdx(null)}
          >
            <motion.figure
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#FBF6EC] p-2">
                <Image
                  src={open.src}
                  alt={open.alt}
                  width={open.w}
                  height={open.h}
                  sizes="90vw"
                  draggable={false}
                  className="h-auto max-h-[76vh] w-auto"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-6 font-stamp text-[11px] uppercase tracking-[0.18em]">
                <span className="text-[#F1E8D6]/80">
                  {open.caption}
                  {selectSet.has(open.src) && (
                    <span className="ml-3 text-[#E5301F]">· select</span>
                  )}
                </span>
                <span className="text-[#E5301F]/80">FR {String(openIdx + 1).padStart(3, "0")}</span>
              </figcaption>
            </motion.figure>

            <div
              className="flex items-center gap-2 font-stamp text-[11px] uppercase tracking-[0.18em]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpenIdx((openIdx - 1 + gallery.length) % gallery.length)}
                className="border border-[#F1E8D6]/30 px-4 py-1.5 text-[#F1E8D6]/70 transition-colors hover:text-[#F1E8D6]"
              >
                ‹ Prev
              </button>
              <button
                type="button"
                onClick={() => setOpenIdx((openIdx + 1) % gallery.length)}
                className="border border-[#F1E8D6]/30 px-4 py-1.5 text-[#F1E8D6]/70 transition-colors hover:text-[#F1E8D6]"
              >
                Next ›
              </button>
              <button
                type="button"
                onClick={() => setOpenIdx(null)}
                className="border border-[#E5301F]/60 px-4 py-1.5 text-[#E5301F] transition-colors hover:bg-[#E5301F] hover:text-[#191410]"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
