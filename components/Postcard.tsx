"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/photos";

type Props = { photo: Photo; className?: string };

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
          <div className="relative aspect-[4/5] overflow-hidden bg-sand/30">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 90vw, 30vw"
              draggable={false}
              className="object-cover object-[50%_25%]"
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
              <div className="h-12 w-10 border border-dashed border-ink/40 font-stamp text-[9px] leading-tight text-ink/50 flex items-center justify-center text-center">
                stamp
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </button>
  );
}
