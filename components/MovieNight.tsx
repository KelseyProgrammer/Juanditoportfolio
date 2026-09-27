"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { videos, muxPoster, formatDuration, MUX_ENV_KEY } from "@/lib/videos";

// Same code-split as the film strip: the Mux chunk loads only when the
// set is switched on for the first time.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/**
 * Movie Night — the motion archive playing on a photographed vintage TV.
 *
 * The set is public/tv/tv-frame.webp with the screen glass punched to
 * transparency (scripts/prepare-tv-frame.mjs), so the video sits BEHIND
 * the photo and shows through the tube hole — the bronze bezel naturally
 * overlaps the picture. Controls are invisible buttons positioned over
 * the photo's real dial/buttons (md+, with typewriter labels off the
 * cabinet's right edge); phones get a 44px knob strip under the label
 * plate instead, because four stacked photo buttons at 330px wide can't
 * give honest tap targets. The dial is a circular cutout of the photo's
 * own knob, rotated to the current channel; drag or click it to surf.
 *
 * Off by default (no video bytes). The power switch is the user gesture:
 * from then on every channel is a live broadcast — flip to it and it's
 * already playing, muted, behind a burst of static. Clips auto-advance
 * to the next channel when they end.
 *
 * Reduced motion: no static, no flicker, and channels wait as poster
 * frames behind an explicit play button instead of autoplaying.
 */

const STATIC_BURST_MS = 400;
const POWER_OFF_MS = 350;
// Generous enough that a cold first power-on (player chunk + manifest)
// doesn't flash the fallback Play button while autoplay is still in flight.
const STALL_CHECK_MS = 2500;

// Geometry measured from the photo by scripts/prepare-tv-frame.mjs,
// as % of the cropped frame (1948×1588). Re-run that script if the
// source image ever changes — it prints this block.
const TV = {
  aspect: "1948 / 1588",
  screen: { left: 9.19, top: 8.12, width: 68.12, height: 64.48 },
  dial: { left: 84.7, top: 13.98, width: 10.68, height: 13.1 },
  buttons: [
    { left: 87.37, top: 31.36, width: 4.62, height: 4.41 },
    { left: 87.37, top: 37.85, width: 4.62, height: 4.22 },
    { left: 87.37, top: 44.14, width: 4.62, height: 4.41 },
    { left: 87.37, top: 51.57, width: 4.62, height: 4.22 },
  ],
  power: { left: 86.6, top: 61.96, width: 6.01, height: 6.74 },
  powerLens: { left: 87.83, top: 63.6, width: 3.39, height: 3.15 },
} as const;

type Box = { left: number; top: number; width: number; height: number };
const box = (b: Box) => ({
  left: `${b.left}%`,
  top: `${b.top}%`,
  width: `${b.width}%`,
  height: `${b.height}%`,
});
const centerY = (b: Box) => b.top + b.height / 2;

const pad = (n: number) => String(n).padStart(2, "0");

export default function MovieNight() {
  const reduceMotion = useReducedMotion();
  const [power, setPower] = useState(false);
  const [poweringOff, setPoweringOff] = useState(false);
  const [channel, setChannel] = useState(0);
  // Dial rotation accumulates so wrapping CH 10 → CH 01 keeps spinning
  // forward instead of unwinding a full turn.
  const [turns, setTurns] = useState(0);
  const [muted, setMuted] = useState(true);
  const [burst, setBurst] = useState(false);
  const [osdKey, setOsdKey] = useState(0); // remount restarts the OSD fade
  const [error, setError] = useState(false);
  const [armed, setArmed] = useState(false); // reduced-motion: play pressed
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [stalled, setStalled] = useState(false); // autoplay never actually started
  const screenRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ angle: number; acc: number } | null>(null);
  const dialDragged = useRef(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();
  const offTimer = useRef<ReturnType<typeof setTimeout>>();
  const stallTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // iPhone Safari has no element fullscreen; we fall back to the native
    // video's webkitEnterFullscreen there, so the button stays.
    setCanFullscreen(
      document.fullscreenEnabled || /iPhone|iPad/.test(navigator.userAgent)
    );
    return () => {
      clearTimeout(burstTimer.current);
      clearTimeout(offTimer.current);
      clearTimeout(stallTimer.current);
    };
  }, []);

  // Safari (especially Low Power Mode) can silently reject autoplay,
  // leaving a frozen poster with chrome hidden. If the player hasn't
  // fired "playing" shortly after mount, surface an explicit Play button.
  useEffect(() => {
    clearTimeout(stallTimer.current);
    if (!power || error || (reduceMotion && !armed)) {
      setStalled(false);
      return;
    }
    setStalled(false);
    stallTimer.current = setTimeout(() => setStalled(true), STALL_CHECK_MS);
    return () => clearTimeout(stallTimer.current);
  }, [power, channel, armed, reduceMotion, error]);

  if (videos.length === 0) return null;

  const video = videos[channel];
  const vertical = video.h > video.w;
  const notch = 360 / videos.length;

  const staticBurst = () => {
    if (reduceMotion) return;
    setBurst(true);
    clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBurst(false), STATIC_BURST_MS);
  };

  const changeChannel = (dir: 1 | -1) => {
    setChannel((c) => (c + dir + videos.length) % videos.length);
    setTurns((t) => t + dir);
    setError(false);
    setArmed(false);
    setOsdKey((k) => k + 1);
    staticBurst();
  };

  const powerOn = () => {
    setPower(true);
    setError(false);
    setArmed(false);
    setOsdKey((k) => k + 1);
    staticBurst();
  };

  const powerOff = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setPower(false);
    if (reduceMotion) return;
    setPoweringOff(true);
    clearTimeout(offTimer.current);
    offTimer.current = setTimeout(() => setPoweringOff(false), POWER_OFF_MS);
  };

  // ↑/↓ surf while focus is anywhere inside the set — no global listeners.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!power) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      changeChannel(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      changeChannel(-1);
    }
  };

  // The dial turns by dragging: accumulate pointer rotation around the
  // knob's center and click over a channel per 36° notch. A plain click
  // (no meaningful rotation) advances one channel.
  const dialAngle = (e: React.PointerEvent) => {
    const r = dialRef.current!.getBoundingClientRect();
    return (
      (Math.atan2(
        e.clientY - (r.top + r.height / 2),
        e.clientX - (r.left + r.width / 2)
      ) *
        180) /
      Math.PI
    );
  };
  const onDialPointerDown = (e: React.PointerEvent) => {
    if (!power) return;
    dialRef.current?.setPointerCapture(e.pointerId);
    drag.current = { angle: dialAngle(e), acc: 0 };
    dialDragged.current = false;
  };
  const onDialPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const a = dialAngle(e);
    let d = a - drag.current.angle;
    if (d > 180) d -= 360;
    else if (d < -180) d += 360;
    drag.current.angle = a;
    drag.current.acc += d;
    while (drag.current.acc >= notch) {
      drag.current.acc -= notch;
      dialDragged.current = true;
      changeChannel(1);
    }
    while (drag.current.acc <= -notch) {
      drag.current.acc += notch;
      dialDragged.current = true;
      changeChannel(-1);
    }
    if (Math.abs(drag.current.acc) > 12) dialDragged.current = true;
  };
  const onDialPointerUp = () => {
    drag.current = null;
  };
  const onDialClick = () => {
    if (dialDragged.current) {
      dialDragged.current = false;
      return;
    }
    changeChannel(1);
  };

  const goFullscreen = () => {
    const el = screenRef.current;
    // iPhone: only the native <video> may enter fullscreen. mux-player
    // exposes it as .media.nativeEl on the custom element.
    const player = el?.querySelector("mux-player") as
      | { media?: { nativeEl?: HTMLVideoElement & { webkitEnterFullscreen?: () => void } } }
      | null;
    const nativeEl = player?.media?.nativeEl;
    // Native video fullscreen rotates/controls better on iPhone even where
    // element fullscreen exists (iOS 16.4+), so prefer it there outright.
    if (/iPhone/.test(navigator.userAgent) && nativeEl?.webkitEnterFullscreen) {
      nativeEl.webkitEnterFullscreen();
      return;
    }
    // Old iPads (pre-16.4) have no element fullscreen at all — go straight
    // to the native video there instead of silently no-opping.
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch(() => nativeEl?.webkitEnterFullscreen?.());
    } else {
      nativeEl?.webkitEnterFullscreen?.();
    }
  };

  // Invisible hit areas over the photo's controls (lg+, where a pointer
  // can hit a 30px button and the labels have room off the cabinet's
  // right edge). Hover darkens the control slightly; pressing insets it —
  // like pushing real plastic.
  const overlay =
    "absolute hidden cursor-pointer rounded-[6px] transition-colors duration-150 hover:bg-black/20 active:bg-black/40 active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.65)] disabled:pointer-events-none lg:block";
  const overlayLabel =
    "pointer-events-none absolute hidden whitespace-nowrap font-stamp text-[9px] uppercase tracking-[0.14em] text-[#F1E8D6]/45 lg:block";

  // Phone/tablet strip: honest 44px targets under the label plate.
  const knob =
    "flex h-11 w-11 items-center justify-center border border-[#F1E8D6]/30 font-stamp text-[9px] uppercase tracking-[0.08em] text-[#F1E8D6]/70 transition-colors hover:text-[#F1E8D6] disabled:pointer-events-none disabled:opacity-30";

  const buttonActions: {
    label: string;
    text: string;
    onClick: () => void;
    disabled: boolean;
    pressed?: boolean;
    hidden?: boolean;
  }[] = [
    { label: "Channel up", text: "CH ▲", onClick: () => changeChannel(1), disabled: !power },
    { label: "Channel down", text: "CH ▼", onClick: () => changeChannel(-1), disabled: !power },
    {
      label: "Sound",
      text: "SND",
      onClick: () => setMuted((m) => !m),
      disabled: !power,
      pressed: !muted,
    },
    {
      label: "Watch fullscreen",
      text: "ZOOM",
      onClick: goFullscreen,
      disabled: !power,
      hidden: !canFullscreen,
    },
  ];

  return (
    <section
      id="movie-night"
      className="border-t border-[#F1E8D6]/15 bg-[#191410] px-6 py-16 md:px-14"
    >
      <div className="mb-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h2 className="font-display text-3xl text-[#F1E8D6]/75 md:text-4xl">
          Movie Night
        </h2>
        <p className="font-stamp text-xs uppercase tracking-widest text-[#E5301F]">
          {videos.length} channels · dial to surf
        </p>
      </div>

      {/* The set */}
      <div className="mx-auto w-[min(88vw,720px)]" onKeyDown={onKeyDown}>
        <div className="relative" style={{ aspectRatio: TV.aspect }}>
          {/* Tube — everything here sits BEHIND the TV photo and shows
              through the transparent screen hole */}
          <div
            ref={screenRef}
            className="absolute overflow-hidden bg-black"
            style={box(TV.screen)}
          >
            {/* Vertical clips sit on a bed of quiet static */}
            {power && vertical && !reduceMotion && !error && (
              <div aria-hidden className="tv-static absolute inset-0 opacity-30" />
            )}

            {power &&
              !error &&
              (reduceMotion && !armed ? (
                <>
                  <Image
                    src={muxPoster(video.playbackId, 960, video.posterTime)}
                    alt={video.alt}
                    fill
                    sizes="(max-width: 768px) 62vw, 500px"
                    className={vertical ? "object-contain" : "object-cover"}
                  />
                  <button
                    type="button"
                    onClick={() => setArmed(true)}
                    aria-label={`Play ${video.title}`}
                    className="absolute inset-0 z-10 flex items-center justify-center font-stamp text-sm uppercase tracking-[0.18em] text-[#F1E8D6]"
                  >
                    <span className="border border-[#E5301F]/70 bg-[#191410]/70 px-4 py-2 text-[#E5301F]">
                      ▸ Play
                    </span>
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative max-h-full max-w-full"
                    style={
                      vertical
                        ? { aspectRatio: `${video.w} / ${video.h}`, height: "100%" }
                        : { width: "100%", height: "100%" }
                    }
                  >
                    <MuxPlayer
                      key={video.playbackId}
                      playbackId={video.playbackId}
                      poster={muxPoster(video.playbackId, 960, video.posterTime)}
                      streamType="on-demand"
                      autoPlay={muted ? "muted" : "any"}
                      muted={muted}
                      nohotkeys
                      accentColor="#E5301F"
                      envKey={MUX_ENV_KEY}
                      metadata={{ video_title: video.title }}
                      onEnded={() => changeChannel(1)}
                      onError={() => setError(true)}
                      onVolumeChange={(e) =>
                        setMuted((e.currentTarget as HTMLMediaElement).muted)
                      }
                      onPlaying={() => {
                        clearTimeout(stallTimer.current);
                        setStalled(false);
                      }}
                      style={{
                        "--controls": "none",
                        // The tube hole is the frame: landscape clips fill
                        // it edge to edge, vertical ones keep their shape.
                        "--media-object-fit": vertical ? "contain" : "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              ))}

            {/* Lost the feed */}
            {power && error && (
              <div className="tv-static absolute inset-0 z-10 flex items-center justify-center">
                <span className="bg-[#191410]/80 px-3 py-1 font-stamp text-xs uppercase tracking-[0.18em] text-[#F1E8D6]">
                  No Signal
                </span>
              </div>
            )}

            {/* Channel-change snow */}
            {burst && <div aria-hidden className="tv-static absolute inset-0 z-20" />}

            {/* Autoplay never actually started (e.g. Safari Low Power
                Mode) — surface an explicit play button on the live element. */}
            {power && !error && stalled && (
              <button
                type="button"
                onClick={() => {
                  const p = screenRef.current?.querySelector("mux-player") as
                    | { play?: () => Promise<void> }
                    | null;
                  p?.play?.()?.catch?.(() => {});
                }}
                aria-label={`Play ${video.title}`}
                className="absolute inset-0 z-[25] flex items-center justify-center font-stamp text-sm uppercase tracking-[0.18em] text-[#F1E8D6]"
              >
                <span className="border border-[#E5301F]/70 bg-[#191410]/70 px-4 py-2 text-[#E5301F]">
                  ▸ Play
                </span>
              </button>
            )}

            {/* Channel OSD */}
            {power && !reduceMotion && (
              <span
                key={osdKey}
                aria-hidden
                className="tv-osd absolute right-[6%] top-[4%] z-30 font-stamp text-lg tracking-[0.18em] text-[#F1E8D6]"
              >
                CH {pad(channel + 1)}
              </span>
            )}

            {/* Power-off collapse */}
            {poweringOff && (
              <div aria-hidden className="tv-off absolute inset-0 z-40 bg-[#FBF6EC]" />
            )}

            {/* Glass: scanlines + vignette while on, faint reflection while off */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 z-30 ${
                power ? "tv-scanlines" : "tv-glass-off"
              }`}
            />
          </div>

          {/* The set itself, screen hole punched to transparency */}
          <Image
            src="/tv/tv-frame.webp"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 768px) 88vw, 720px"
            className="pointer-events-none z-10 select-none object-contain"
          />

          {/* The photo's own dial, cut out and rotated to the channel */}
          <div
            aria-hidden
            className="pointer-events-none absolute z-20 transition-transform duration-300 motion-reduce:transition-none"
            style={{ ...box(TV.dial), transform: `rotate(${turns * notch}deg)` }}
          >
            <Image src="/tv/tv-dial.webp" alt="" fill sizes="80px" className="select-none" />
          </div>

          {/* Power lens: dimmed while off, warm glow while on */}
          <div
            aria-hidden
            className={`pointer-events-none absolute z-20 rounded-[4px] bg-[#160805]/80 transition-opacity duration-300 ${
              power ? "opacity-0" : "opacity-100"
            }`}
            style={box(TV.powerLens)}
          />
          <div
            aria-hidden
            className={`pointer-events-none absolute z-20 transition-opacity duration-300 ${
              power ? "opacity-100" : "opacity-0"
            }`}
            style={{
              left: `${TV.powerLens.left + TV.powerLens.width / 2 - 4.5}%`,
              top: `${TV.powerLens.top + TV.powerLens.height / 2 - 5.5}%`,
              width: "9%",
              height: "11%",
              background:
                "radial-gradient(ellipse at center, rgba(229,48,31,0.5), transparent 65%)",
            }}
          />

          {/* Controls over the photo (md+); phones use the strip below */}
          <button
            ref={dialRef}
            type="button"
            onClick={onDialClick}
            onPointerDown={onDialPointerDown}
            onPointerMove={onDialPointerMove}
            onPointerUp={onDialPointerUp}
            onPointerCancel={onDialPointerUp}
            disabled={!power}
            aria-label="Next channel (dial)"
            className={`${overlay} z-30 rounded-full`}
            style={{ ...box(TV.dial), touchAction: "none" }}
          />
          <span className={overlayLabel} style={{ left: "101%", top: `${centerY(TV.dial)}%`, transform: "translateY(-50%)" }}>
            ← dial · surf
          </span>

          {buttonActions.map((b, i) =>
            b.hidden ? null : (
              <button
                key={b.text}
                type="button"
                onClick={b.onClick}
                disabled={b.disabled}
                aria-label={b.label}
                aria-pressed={b.pressed}
                className={`${overlay} z-30`}
                style={box(TV.buttons[i])}
              />
            )
          )}
          {buttonActions.map((b, i) =>
            b.hidden ? null : (
              <span
                key={b.text}
                className={`${overlayLabel} ${b.pressed ? "text-[#E5301F]" : ""}`}
                style={{
                  left: "101%",
                  top: `${centerY(TV.buttons[i])}%`,
                  transform: "translateY(-50%)",
                }}
              >
                ← {b.text}
              </span>
            )
          )}

          <button
            type="button"
            onClick={() => (power ? powerOff() : powerOn())}
            aria-pressed={power}
            aria-label="Power"
            className={`${overlay} z-30`}
            style={box(TV.power)}
          />
          <span
            className={`${overlayLabel} ${power ? "text-[#E5301F]/80" : ""}`}
            style={{ left: "101%", top: `${centerY(TV.power)}%`, transform: "translateY(-50%)" }}
          >
            ← PWR
          </span>
        </div>

        {/* Label plate */}
        <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#F1E8D6]/15 pt-2 font-stamp text-[11px] uppercase tracking-[0.18em]">
          <span className="truncate text-[#F1E8D6]/70">
            {power ? video.title : "Juandito Broadcasting"}
          </span>
          <span role="status" className="shrink-0 text-[#E5301F]/80">
            {power
              ? `CH ${pad(channel + 1)}/${pad(videos.length)} · ${formatDuration(video.duration)}`
              : "Off Air"}
            {power && <span className="sr-only"> — {video.title}</span>}
          </span>
        </div>

        {/* Touch controls: below lg the photo's buttons are too small to
            tap honestly, so give real 44px targets here instead */}
        <div className="mt-3 flex justify-center gap-2.5 lg:hidden">
          {buttonActions.map((b) =>
            b.hidden ? null : (
              <button
                key={b.text}
                type="button"
                onClick={b.onClick}
                disabled={b.disabled}
                aria-label={b.label}
                aria-pressed={b.pressed}
                className={`${knob} ${b.pressed ? "border-[#E5301F]/70 text-[#E5301F]" : ""}`}
              >
                {b.text.replace(" ", "")}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => (power ? powerOff() : powerOn())}
            aria-pressed={power}
            aria-label="Power"
            className={`flex h-11 w-11 items-center justify-center border font-stamp text-[9px] uppercase tracking-[0.08em] transition-colors ${
              power
                ? "border-[#E5301F] bg-[#E5301F] text-[#191410]"
                : "border-[#E5301F]/60 text-[#E5301F] hover:bg-[#E5301F]/15"
            }`}
          >
            PWR
          </button>
        </div>
      </div>
    </section>
  );
}
