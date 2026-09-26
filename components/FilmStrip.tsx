"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import type { Series, SeriesFrame } from "@/lib/series";
import { formatDuration, muxPoster } from "@/lib/videos";

// Loaded only when a video frame is actually shown — keeps the Mux player
// chunk out of the page bundle while the archive is stills-only.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/**
 * FilmStrip — a series opened as a length of 35mm film.
 *
 * One large active frame on the light table, the whole series running
 * below it as a strip with sprocket holes and edge numbers. FR numbers
 * stay global (the frame's position in the full gallery), matching the
 * contact sheet — a merged series reads as non-contiguous edge code,
 * like frames spliced from different rolls. Video clips ride at the end
 * of the strip as MOV frames: poster in the rail, full player when
 * active, no video bytes until play is pressed.
 */

type FilmStripProps = {
  series: Series;
  onClose: () => void;
  /** Shared with the clicked grid hero's mat for the portal morph;
      absent on direct-link opens and under reduced motion. */
  layoutId?: string;
};

const fr = (globalIndex: number) => String(globalIndex + 1).padStart(3, "0");
const frameKey = (f: SeriesFrame) =>
  f.kind === "photo" ? f.photo.src : f.video.playbackId;
const frameLabel = (f: SeriesFrame) =>
  f.kind === "photo"
    ? `FR ${fr(f.globalIndex)}`
    : `MOV ${String(f.videoIndex + 1).padStart(2, "0")}`;
const frameAlt = (f: SeriesFrame) => (f.kind === "photo" ? f.photo.alt : f.video.alt);
/** Both kinds carry w/h for the aspect box. */
const frameDims = (f: SeriesFrame) => (f.kind === "photo" ? f.photo : f.video);

export default function FilmStrip({ series, onClose, layoutId }: FilmStripProps) {
  const reduceMotion = useReducedMotion();
  const count = series.frames.length;
  // Direction rides along with the index so the enter-slide knows which
  // way the film advanced.
  const [[active, direction], setPosition] = useState<[number, number]>(() => [
    Math.max(0, series.frames.indexOf(series.hero)),
    0,
  ]);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const frame = series.frames[active];

  // Focus enters the dialog on open; Tab wraps within it.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const goTo = (i: number, dir: number) => setPosition([(i + count) % count, dir]);
  const step = (dir: number) => count > 1 && goTo(active + dir, dir);

  // Escape closes, arrows advance the film; body scroll locks while open
  // (same pattern as the contact-sheet lightbox).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Inside the video player, arrow keys seek — don't advance the film.
      if ((e.target as Element | null)?.closest?.("mux-player")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  });

  // Keep the active thumb centered in the rail as the film advances.
  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  // The slide-in on frame change runs via controls on ONE long-lived
  // motion.div. Remounting a keyed motion element inside the dialog leaves
  // AnimatePresence waiting on an orphaned presence entry, so the overlay's
  // exit would never complete (frozen at opacity 0, scroll still locked).
  const slide = useAnimationControls();
  useEffect(() => {
    if (reduceMotion || direction === 0) return;
    slide.set({ x: direction * 40, opacity: 0 });
    slide.start({
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 28 },
    });
  }, [active, direction, reduceMotion, slide]);

  const neighbors =
    count > 1
      ? Array.from(new Set([(active + 1) % count, (active - 1 + count) % count]))
          .filter((i) => i !== active)
          .map((i) => series.frames[i])
      : [];

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${series.title} — film strip`}
      tabIndex={-1}
      onKeyDown={trapTab}
      className="fixed inset-0 z-[80] flex flex-col bg-[#191410]/[0.98] px-4 pt-4 outline-none md:px-10 md:pt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* Header: series title · position · close */}
      <div className="flex items-baseline justify-between gap-4 font-stamp text-[11px] uppercase tracking-[0.18em]">
        <span className="truncate text-[#F1E8D6]/80">{series.title}</span>
        <span role="status" className="shrink-0 text-[#E5301F]">
          {active + 1} / {series.frames.length}
          <span className="sr-only">
            {` — frame ${active + 1} of ${series.frames.length}, ${frameLabel(frame)}`}
          </span>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 border border-[#E5301F]/60 px-4 py-1.5 font-stamp text-[11px] uppercase tracking-[0.18em] text-[#E5301F] transition-colors hover:bg-[#E5301F] hover:text-[#191410]"
        >
          Close
        </button>
      </div>

      {/* The active frame on the light table */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-4">
        <figure className="flex min-h-0 flex-col">
          <motion.div
            layoutId={layoutId}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative min-h-0 bg-[#FBF6EC] p-2"
          >
            <motion.div
              // The box is fully determined by viewport + aspect ratio, so
              // the mat keeps its shape while the incoming frame is still
              // fetching instead of collapsing to a sliver.
              style={{
                aspectRatio: `${frameDims(frame).w} / ${frameDims(frame).h}`,
                height: `min(52vh, calc(86vw * ${(frameDims(frame).h / frameDims(frame).w).toFixed(4)}))`,
              }}
              animate={slide}
              // Dragging a video would fight the player's scrubber — swipe
              // stays available via arrows and the rail.
              drag={count > 1 && !reduceMotion && frame.kind === "photo" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const power = info.offset.x * info.velocity.x;
                if (info.offset.x < -80 || (info.offset.x < 0 && power > 8000)) {
                  step(1);
                } else if (info.offset.x > 80 || (info.offset.x > 0 && power > 8000)) {
                  step(-1);
                }
              }}
            >
              {frame.kind === "photo" ? (
                <Image
                  key={frame.photo.src}
                  src={frame.photo.src}
                  alt={frame.photo.alt}
                  width={frame.photo.w}
                  height={frame.photo.h}
                  sizes="(max-width: 768px) 88vw, 60vw"
                  priority
                  draggable={false}
                  className="h-full w-full"
                />
              ) : (
                <MuxPlayer
                  key={frame.video.playbackId}
                  playbackId={frame.video.playbackId}
                  poster={muxPoster(frame.video.playbackId)}
                  streamType="on-demand"
                  preload="none"
                  accentColor="#E5301F"
                  style={{ height: "100%", width: "100%" }}
                />
              )}
            </motion.div>
            {/* Preload the neighboring still frames: a real (but invisible)
                layout box is required — display:none or loading="lazy" would
                never fetch them. Videos load nothing until played. */}
            <div aria-hidden className="pointer-events-none absolute inset-2 overflow-hidden opacity-0">
              {neighbors.map((n) =>
                n.kind === "photo" ? (
                  <Image
                    key={n.photo.src}
                    src={n.photo.src}
                    alt=""
                    width={n.photo.w}
                    height={n.photo.h}
                    sizes="(max-width: 768px) 92vw, 70vw"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : null
              )}
            </div>
          </motion.div>
          <figcaption className="mt-2 flex items-baseline justify-between gap-6 font-stamp text-[11px] uppercase tracking-[0.18em]">
            <span className="text-[#F1E8D6]/70">
              {frame.kind === "photo" ? frame.photo.caption : series.title}
            </span>
            <span className="text-[#E5301F]/80">
              {frameLabel(frame)}
              {frame.kind === "video" && (
                <span className="ml-3 text-[#F1E8D6]/45">{formatDuration(frame.video.duration)}</span>
              )}
            </span>
          </figcaption>
        </figure>
      </div>

      {/* The strip: sprockets and every frame of the series */}
      <div className="rail-scroll -mx-4 overflow-x-auto md:-mx-10">
        <div className="w-max min-w-full bg-black px-4 md:px-10">
          <div aria-hidden className="sprockets" />
          <div className="flex gap-2 py-1">
            {series.frames.map((f, i) => (
              <button
                key={frameKey(f)}
                type="button"
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                onClick={() => goTo(i, Math.sign(i - active))}
                aria-label={`${f.kind === "photo" ? "Frame" : "Clip"} ${frameLabel(f)} — ${frameAlt(f)}`}
                aria-current={i === active}
                className={`shrink-0 ${
                  i === active ? "outline outline-2 outline-[#E5301F]" : ""
                }`}
              >
                <span className="relative block h-16 w-24 overflow-hidden bg-black">
                  <Image
                    src={f.kind === "photo" ? f.photo.src : muxPoster(f.video.playbackId, 192)}
                    alt=""
                    fill
                    sizes="96px"
                    draggable={false}
                    className={`object-cover object-[50%_20%] transition-opacity ${
                      i === active ? "" : "opacity-60 hover:opacity-90"
                    }`}
                  />
                  {f.kind === "video" && (
                    <span className="absolute bottom-0.5 right-0.5 bg-[#191410]/80 px-1 font-stamp text-[8px] tracking-[0.08em] text-[#F1E8D6]/80">
                      ▸ {formatDuration(f.video.duration)}
                    </span>
                  )}
                </span>
                <span
                  className={`block px-0.5 py-0.5 text-left font-stamp text-[9px] tracking-[0.12em] ${
                    i === active ? "text-[#E5301F]" : "text-[#F1E8D6]/45"
                  }`}
                >
                  {f.kind === "photo" ? fr(f.globalIndex) : frameLabel(f)}
                </span>
              </button>
            ))}
          </div>
          <div aria-hidden className="sprockets" />
        </div>
      </div>
    </motion.div>
  );
}
