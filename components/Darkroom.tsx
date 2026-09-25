"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { gallery, type GalleryPhoto } from "@/lib/photos";

/**
 * The Darkroom — every frame in the archive, developed on scroll.
 * Each print enters the viewport as a washed, blurred negative and
 * "develops" into full color as it approaches the middle of the screen,
 * scrubbed by scroll position (Framer useScroll → CSS filter).
 * A red safelight wash fades off the print as it develops.
 */

function DarkroomPrint({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 when the print's top crosses the bottom of the screen,
    // 1 once it has risen to 45% of the viewport — fully developed.
    offset: ["start end", "start 45%"]
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });

  const filter = useTransform(progress, (v) => {
    const u = 1 - v;
    return `invert(${u}) sepia(${0.35 * u}) saturate(${0.25 + 0.75 * v}) brightness(${1.15 - 0.15 * v}) contrast(${0.82 + 0.18 * v}) blur(${10 * u}px)`;
  });
  const safelight = useTransform(progress, [0, 0.7, 1], [0.45, 0.12, 0]);

  const frame = String(index + 1).padStart(3, "0");

  return (
    <figure ref={ref} className="mb-5 break-inside-avoid md:mb-7">
      <div className="bg-[#FBF6EC] p-2 pb-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <div className="relative overflow-hidden bg-black">
          <motion.div style={reduceMotion ? undefined : { filter }}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
              className="block h-auto w-full"
            />
          </motion.div>
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[#E5301F] mix-blend-multiply"
              style={{ opacity: safelight }}
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

export default function Darkroom() {
  return (
    <section id="darkroom" className="border-t-2 border-ink bg-[#191410] px-6 py-16 md:px-14">
      <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl text-[#F1E8D6] md:text-4xl">The Darkroom</h2>
        <p className="font-stamp text-xs uppercase tracking-widest text-[#E5301F]">
          Scroll to develop · {gallery.length} frames
        </p>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 md:gap-7 xl:columns-3">
        {gallery.map((photo, i) => (
          <DarkroomPrint key={photo.src} photo={photo} index={i} />
        ))}
      </div>
    </section>
  );
}
