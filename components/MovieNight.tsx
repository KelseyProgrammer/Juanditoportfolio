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
 * Movie Night — the motion archive as an old CRT television.
 *
 * Off by default (no video bytes). The power switch is the user gesture:
 * from then on every channel is a live broadcast — flip to it and it's
 * already playing, muted, behind a burst of static. The dial and CH keys
 * surf; clips auto-advance to the next channel when they end.
 *
 * Reduced motion: no static, no flicker, and channels wait as poster
 * frames behind an explicit play button instead of autoplaying.
 */

const STATIC_BURST_MS = 400;
const POWER_OFF_MS = 350;

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
  const screenRef = useRef<HTMLDivElement>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();
  const offTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // iPhone Safari has no element fullscreen; we fall back to the native
    // video's webkitEnterFullscreen there, so the button stays.
    setCanFullscreen(
      document.fullscreenEnabled || /iPhone|iPad/.test(navigator.userAgent)
    );
    return () => {
      clearTimeout(burstTimer.current);
      clearTimeout(offTimer.current);
    };
  }, []);

  if (videos.length === 0) return null;

  const video = videos[channel];
  const vertical = video.h > video.w;

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

  const goFullscreen = () => {
    const el = screenRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen();
      return;
    }
    // iPhone: only the native <video> may enter fullscreen. mux-player
    // exposes it as .media.nativeEl on the custom element.
    const player = el?.querySelector("mux-player") as
      | { media?: { nativeEl?: HTMLVideoElement & { webkitEnterFullscreen?: () => void } } }
      | null;
    player?.media?.nativeEl?.webkitEnterFullscreen?.();
  };

  const knob =
    "flex h-9 w-9 items-center justify-center border border-[#F1E8D6]/30 font-stamp text-[9px] uppercase tracking-[0.08em] text-[#F1E8D6]/70 transition-colors hover:text-[#F1E8D6] disabled:pointer-events-none disabled:opacity-30";

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
        <div className="bg-ink p-3 shadow-[0_24px_60px_rgba(0,0,0,0.55)] md:p-5">
          <div className="flex gap-3 md:gap-5">
            {/* Tube */}
            <div
              ref={screenRef}
              className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden bg-black"
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
                      sizes="(max-width: 768px) 88vw, 720px"
                      className="object-contain"
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
                      style={{
                        aspectRatio: `${video.w} / ${video.h}`,
                        height: vertical ? "100%" : undefined,
                        width: vertical ? undefined : "100%",
                      }}
                    >
                      <MuxPlayer
                        key={video.playbackId}
                        playbackId={video.playbackId}
                        poster={muxPoster(video.playbackId, 960, video.posterTime)}
                        streamType="on-demand"
                        autoPlay
                        muted={muted}
                        nohotkeys
                        accentColor="#E5301F"
                        envKey={MUX_ENV_KEY}
                        metadata={{ video_title: video.title }}
                        onEnded={() => changeChannel(1)}
                        onError={() => setError(true)}
                        style={{
                          "--controls": "none",
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

              {/* Channel OSD */}
              {power && !reduceMotion && (
                <span
                  key={osdKey}
                  aria-hidden
                  className="tv-osd absolute right-3 top-2 z-30 font-stamp text-lg tracking-[0.18em] text-[#F1E8D6]"
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

            {/* Control panel */}
            <div className="flex w-11 shrink-0 flex-col items-center gap-2.5 md:w-12">
              {/* The dial — one notch per channel, pointer painted red */}
              <button
                type="button"
                onClick={() => changeChannel(1)}
                disabled={!power}
                aria-label="Next channel (dial)"
                className="relative h-11 w-11 rounded-full border-2 border-[#F1E8D6]/40 bg-black transition-transform duration-300 disabled:pointer-events-none disabled:opacity-30 md:h-12 md:w-12"
                style={{ transform: `rotate(${turns * (360 / videos.length)}deg)` }}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-1 h-3 w-0.5 -translate-x-1/2 bg-[#E5301F]"
                />
              </button>
              <button
                type="button"
                onClick={() => changeChannel(1)}
                disabled={!power}
                aria-label="Channel up"
                className={knob}
              >
                CH▲
              </button>
              <button
                type="button"
                onClick={() => changeChannel(-1)}
                disabled={!power}
                aria-label="Channel down"
                className={knob}
              >
                CH▼
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                disabled={!power}
                aria-pressed={!muted}
                aria-label={muted ? "Turn sound on" : "Turn sound off"}
                className={`${knob} ${muted ? "" : "border-[#E5301F]/70 text-[#E5301F]"}`}
              >
                Snd
              </button>
              {canFullscreen && (
                <button
                  type="button"
                  onClick={goFullscreen}
                  disabled={!power}
                  aria-label="Watch fullscreen"
                  className={knob}
                >
                  Zoom
                </button>
              )}
              <button
                type="button"
                onClick={() => (power ? powerOff() : powerOn())}
                aria-pressed={power}
                aria-label={power ? "Turn the TV off" : "Turn the TV on"}
                className={`mt-auto flex h-9 w-9 items-center justify-center border font-stamp text-[9px] uppercase tracking-[0.08em] transition-colors ${
                  power
                    ? "border-[#E5301F] bg-[#E5301F] text-[#191410]"
                    : "border-[#E5301F]/60 text-[#E5301F] hover:bg-[#E5301F]/15"
                }`}
              >
                Pwr
              </button>
            </div>
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
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
