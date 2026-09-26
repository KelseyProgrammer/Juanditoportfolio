"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

type Mode = "default" | "link" | "photo";
type Tap = { id: number; x: number; y: number; photo: boolean };

/**
 * Aperture cursor. On fine pointers a lens ring glides with the pointer,
 * dilates with focus ticks over photographs, grows gently over links,
 * and fires a shutter on click: an iris blink in the ring, plus a quick
 * white flash when the click lands on a photo.
 *
 * Touch has no resting pointer to follow, so on coarse pointers only the
 * shutter moment translates: each tap blinks the aperture ring at the
 * touch point (with the flash on photos) — every tap fires the shutter.
 */
export default function ApertureCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [hidden, setHidden] = useState(true);
  const [iris, setIris] = useState(0);
  const [flash, setFlash] = useState(0);
  const [tap, setTap] = useState<Tap | null>(null);
  const tapIdRef = useRef(0);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 900, damping: 55, mass: 0.4 });
  const y = useSpring(my, { stiffness: 900, damping: 55, mass: 0.4 });

  // Shutter tap for touch: the ring exists only for the moment of contact.
  // `click` (not pointerdown) so starting a scroll on a photo never fires.
  // Media queries are read directly — framer's useReducedMotion hook in this
  // component knocked out the desktop cursor effect entirely.
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.detail === 0) return; // keyboard-generated click
      const photo = !!(e.target as Element | null)?.closest("img");
      setTap({ id: ++tapIdRef.current, x: e.clientX, y: e.clientY, photo });
      if (photo) setFlash((n) => n + 1);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("aperture-active");

    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setHidden(false);
      const t = e.target as Element | null;
      if (t?.closest("img")) setMode("photo");
      else if (t?.closest("a, button")) setMode("link");
      else setMode("default");
    };
    const down = (e: PointerEvent) => {
      setIris((n) => n + 1);
      if ((e.target as Element | null)?.closest("img")) setFlash((n) => n + 1);
    };
    const leave = () => setHidden(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("aperture-active");
    };
  }, [mx, my]);

  const size = mode === "photo" ? 56 : mode === "link" ? 44 : 30;
  const tick = "absolute bg-rust";

  return (
    <>
      <AnimatePresence>
        {flash > 0 && (
          <motion.div
            key={`f${flash}`}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[90] bg-white"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Shutter tap — coarse pointers only */}
      <AnimatePresence>
        {tap && (
          <motion.div
            key={`t${tap.id}`}
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[100]"
            style={{ x: tap.x, y: tap.y }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.2, 0.7, 1], ease: "easeOut" }}
            onAnimationComplete={() =>
              setTap((t) => (t?.id === tap.id ? null : t))
            }
          >
            <div
              className="relative rounded-full border-2 border-rust"
              style={{
                translate: "-50% -50%",
                width: tap.photo ? 56 : 36,
                height: tap.photo ? 56 : 36,
                boxShadow: "0 0 0 1px rgba(251,246,236,0.55)"
              }}
            >
              {tap.photo && (
                <>
                  <div className={`${tick} left-1/2 top-[3px] h-[6px] w-[1.5px] -translate-x-1/2`} />
                  <div className={`${tick} bottom-[3px] left-1/2 h-[6px] w-[1.5px] -translate-x-1/2`} />
                  <div className={`${tick} left-[3px] top-1/2 h-[1.5px] w-[6px] -translate-y-1/2`} />
                  <div className={`${tick} right-[3px] top-1/2 h-[1.5px] w-[6px] -translate-y-1/2`} />
                </>
              )}
              {/* iris blink */}
              <motion.div
                className="absolute inset-[2px] rounded-full bg-ink/80"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 0.24, delay: 0.1, times: [0, 0.4, 1], ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {enabled && (
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x, y, opacity: hidden ? 0 : 1 }}
      >
        <motion.div
          className="relative rounded-full border-2 border-rust"
          style={{ translate: "-50% -50%", boxShadow: "0 0 0 1px rgba(251,246,236,0.55)" }}
          animate={{ width: size, height: size }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          {/* center dot, hidden while framing a photo */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust"
            animate={{ opacity: mode === "photo" ? 0 : 1 }}
          />
          {/* viewfinder focus ticks while over a photo */}
          <motion.div animate={{ opacity: mode === "photo" ? 1 : 0 }}>
            <div className={`${tick} left-1/2 top-[3px] h-[6px] w-[1.5px] -translate-x-1/2`} />
            <div className={`${tick} bottom-[3px] left-1/2 h-[6px] w-[1.5px] -translate-x-1/2`} />
            <div className={`${tick} left-[3px] top-1/2 h-[1.5px] w-[6px] -translate-y-1/2`} />
            <div className={`${tick} right-[3px] top-1/2 h-[1.5px] w-[6px] -translate-y-1/2`} />
          </motion.div>
          {/* iris blink on click */}
          <AnimatePresence>
            {iris > 0 && (
              <motion.div
                key={`i${iris}`}
                className="absolute inset-[2px] rounded-full bg-ink/80"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.24, times: [0, 0.4, 1], ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      )}
    </>
  );
}
