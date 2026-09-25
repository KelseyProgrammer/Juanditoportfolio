"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Postcard from "./Postcard";
import { photos } from "@/lib/photos";

/**
 * PostcardWall — the "pop" feature.
 * A pile of postcards the visitor can drag around, toss, and flip.
 * Each card lifts on grab, tilts with velocity, and lands with spring physics.
 * Whichever card was touched last comes to the front.
 */
export default function PostcardWall() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [zOrder, setZOrder] = useState<string[]>(photos.map((p) => p.id));

  const bringToFront = (id: string) =>
    setZOrder((prev) => [...prev.filter((x) => x !== id), id]);

  // resting positions: a loose scatter in a 3x2 arrangement
  const positions = [
    { x: "4%", y: "4%" }, { x: "36%", y: "0%" }, { x: "68%", y: "6%" },
    { x: "10%", y: "46%" }, { x: "42%", y: "44%" }, { x: "70%", y: "48%" }
  ];

  return (
    <section id="wall" className="border-t-2 border-ink px-6 py-16 md:px-14">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-display text-3xl md:text-4xl">The Desk</h2>
        <p className="font-stamp text-xs uppercase tracking-widest text-inkfaint">
          Drag to rearrange · Click to flip
        </p>
      </div>

      <div
        ref={boardRef}
        className="relative h-[1000px] w-full overflow-hidden rounded-sm bg-[#E6D9C0] md:h-[1000px]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(46,38,32,0.08) 1px, transparent 1px)",
          backgroundSize: "18px 18px"
        }}
      >
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="absolute w-[46%] cursor-grab active:cursor-grabbing md:w-[24%] md:touch-none"
            style={{
              left: positions[i].x,
              top: positions[i].y,
              zIndex: zOrder.indexOf(photo.id) + 1
            }}
            initial={{ rotate: photo.rotate, opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 16 }}
            drag
            dragConstraints={boardRef}
            dragElastic={0.12}
            dragMomentum
            whileHover={{ scale: 1.02, rotate: photo.rotate * 0.5 }}
            whileDrag={{ scale: 1.04, rotate: photo.rotate * 2, boxShadow: "0 30px 50px rgba(46,38,32,0.3)" }}
            onPointerDown={() => bringToFront(photo.id)}
          >
            <Postcard photo={photo} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
