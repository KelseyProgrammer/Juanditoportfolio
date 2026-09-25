"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/photos";

type Props = { photo: Photo; className?: string };

/** Trans Am-style firebird: spread wings, flame tail, stamped in rust. */
function FirebirdStamp() {
  const wing = (
    <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M31.5 21 C38 16.5 46 12 54 8.5 C50 15.5 43.5 20 36 23" />
      <path d="M31.5 26 C39 23 47 21 54 19.5 C49 24.5 42 27.5 35 29.5" />
      <path d="M31.5 31 C38 29.5 44 29.5 50 30 C45 32.5 39 34 34 34.5" />
    </g>
  );
  return (
    <svg viewBox="0 0 60 60" aria-hidden className="h-full w-full text-rust">
      {wing}
      <g transform="matrix(-1 0 0 1 60 0)">{wing}</g>
      <path d="M30 7.5 L33 11.5 L30 15 L27 11.5 Z" fill="currentColor" />
      <path d="M30 13 C32.2 18 32.2 27 30 37 C27.8 27 27.8 18 30 13 Z" fill="currentColor" />
      <path d="M30 37 C33 41.5 32.5 47 30 52.5 C27.5 47 27 41.5 30 37 Z" fill="currentColor" />
      <path d="M26.5 40 C24.5 43.5 24 46.5 25 49.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M33.5 40 C35.5 43.5 36 46.5 35 49.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Postcard({ photo, className = "" }: Props) {
  const [flipped, setFlipped] = useState(false);
  const downPos = useRef<{ x: number; y: number } | null>(null);

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        downPos.current = { x: e.clientX, y: e.clientY };
      }}
      onClick={(e) => {
        // Only flip on a true tap — a drag that ends on the card is not a flip.
        const d = downPos.current;
        if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) return;
        setFlipped((f) => !f);
      }}
      aria-label={`${photo.caption}. Click to flip the postcard.`}
      aria-pressed={flipped}
      className={`group relative block w-full select-none text-left [perspective:1200px] ${className}`}
    >
      <motion.div
        className="relative w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* FRONT */}
        <div className="bg-white p-3 pb-8 shadow-postcard [backface-visibility:hidden]">
          {/* True postcard proportions: 2:3 matches the archive's native frame,
              so portrait shots crop little or not at all — heads stay in frame. */}
          <div className="relative aspect-[2/3] overflow-hidden bg-sand/30">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 90vw, 30vw"
              draggable={false}
              className="object-cover object-[50%_20%]"
            />
          </div>
          <div className="mt-3 text-center font-stamp text-[13px] tracking-wide">{photo.caption}</div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-[#FBF6EC] p-6 shadow-postcard [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="font-stamp text-[11px] uppercase tracking-[0.2em] text-rust">Post Card</div>
              <p className="mt-4 font-display text-2xl leading-snug text-ink">{photo.note ?? "[Note from the shoot]"}</p>
            </div>
            <div className="flex items-end justify-between border-t border-ink/20 pt-4">
              <div className="font-stamp text-xs text-inkfaint">{photo.caption}</div>
              <div className="h-14 w-12 border border-dashed border-ink/40 p-1">
                <FirebirdStamp />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </button>
  );
}
