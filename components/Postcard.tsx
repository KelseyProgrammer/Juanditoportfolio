"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Photo } from "@/lib/photos";

type Props = { photo: Photo; className?: string };

/** Lightning bolt outline, stamped in rust. */
function LightningStamp() {
  return (
    <svg viewBox="0 0 60 60" aria-hidden className="h-full w-full text-rust">
      <path
        d="M33 6 L17 34 L27.5 34 L23 54 L43 25 L31.5 25 L38.5 6 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
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
      // Container query root: the back's type and stamp scale with the
      // card's own width, so small desk cards on mobile never overflow.
      style={{ containerType: "inline-size" }}
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
        <div
          className="absolute inset-0 overflow-hidden bg-[#FBF6EC] shadow-postcard [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ padding: "clamp(10px, 7cqw, 24px)" }}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <div
                className="font-stamp uppercase tracking-[0.2em] text-rust"
                style={{ fontSize: "clamp(8px, 4cqw, 11px)" }}
              >
                Post Card
              </div>
              <p
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(11px, 7cqw, 18px)",
                  lineHeight: 1.5,
                  marginTop: "clamp(6px, 4cqw, 16px)"
                }}
              >
                {photo.note ?? "[Note from the shoot]"}
              </p>
            </div>
            <div
              className="flex items-end justify-between border-t border-ink/20"
              style={{ paddingTop: "clamp(6px, 3.5cqw, 16px)" }}
            >
              <div className="font-stamp text-inkfaint" style={{ fontSize: "clamp(8px, 4.5cqw, 12px)" }}>
                {photo.caption}
              </div>
              <div
                className="shrink-0 border border-dashed border-ink/40 p-1"
                style={{ width: "clamp(26px, 14cqw, 48px)", height: "clamp(30px, 17cqw, 56px)" }}
              >
                <LightningStamp />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </button>
  );
}
