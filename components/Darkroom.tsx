"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { gallery, type GalleryPhoto } from "@/lib/photos";

/**
 * The Darkroom — every frame in the archive, developed on entry.
 * Each print arrives as a washed, blurred negative under a red safelight
 * and pours into full color once it enters the viewport — a single
 * time-based develop per print, so the motion stays fluid regardless
 * of how the visitor scrolls.
 */

const DEVELOP = { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };

const printVariants = {
  negative: {
    filter:
      "invert(1) sepia(0.35) saturate(0.3) brightness(1.12) contrast(0.85) blur(8px)"
  },
  developed: {
    filter:
      "invert(0) sepia(0) saturate(1) brightness(1) contrast(1) blur(0px)",
    transition: DEVELOP
  }
};

const safelightVariants = {
  negative: { opacity: 0.45 },
  developed: { opacity: 0, transition: DEVELOP }
};

function DarkroomPrint({ photo, index }: { photo: GalleryPhoto; index: number }) {
  const reduceMotion = useReducedMotion();
  const frame = String(index + 1).padStart(3, "0");

  return (
    <figure className="mb-5 break-inside-avoid md:mb-7">
      <div className="bg-[#FBF6EC] p-2 pb-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <motion.div
          className="relative overflow-hidden bg-black"
          initial={reduceMotion ? false : "negative"}
          whileInView="developed"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={printVariants}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 30vw"
              draggable={false}
              className="block h-auto w-full"
            />
          </motion.div>
          <motion.div
            aria-hidden
            variants={safelightVariants}
            className="pointer-events-none absolute inset-0 bg-[#E5301F] mix-blend-multiply"
          />
        </motion.div>
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
