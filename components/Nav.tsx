"use client";

import { videos } from "@/lib/videos";

/**
 * Anchor scrolling with settle correction. Sections above the target
 * (Darkroom prints especially) use content-visibility with estimated
 * placeholder heights, so the page's layout shifts while scrolling past
 * them and a plain fragment jump overshoots. Keep retargeting until the
 * section actually rests at the top — and stand down the moment the
 * user scrolls on their own.
 */
function goToSection(e: React.MouseEvent<HTMLAnchorElement>) {
  const hash = e.currentTarget.getAttribute("href");
  const el = hash && hash.length > 1 ? document.querySelector(hash) : null;
  if (!el) return; // fall back to the default jump
  e.preventDefault();
  history.pushState(null, "", hash);
  el.scrollIntoView({ behavior: "smooth" });

  const ctrl = new AbortController();
  const done = () => {
    clearInterval(timer);
    ctrl.abort();
  };
  const timer = setInterval(() => {
    if (Math.abs(el.getBoundingClientRect().top) > 8) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      done();
    }
  }, 400);
  setTimeout(done, 3000);
  for (const ev of ["wheel", "touchstart", "keydown"] as const) {
    window.addEventListener(ev, done, { signal: ctrl.signal });
  }
}

export default function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-ink px-6 py-6 md:px-14">
      <a href="#" className="font-display text-2xl">Juandito Bandito</a>
      {/* Phones: the links take their own full row under the signature and
          spread edge to edge — one deliberate ruled index line instead of a
          ragged wrap. 11px is the stamp voice's floor (see DESIGN.md). */}
      <nav className="flex w-full flex-wrap justify-between gap-x-3 gap-y-2 font-stamp text-[11px] uppercase tracking-[0.14em] sm:w-auto sm:justify-normal sm:gap-4 sm:text-xs md:gap-9">
        <a href="#wall" onClick={goToSection} className="hover:text-rust">Work</a>
        <a href="#darkroom" onClick={goToSection} className="hover:text-rust">Darkroom</a>
        {videos.length > 0 && (
          <a href="#movie-night" onClick={goToSection} className="whitespace-nowrap hover:text-rust">Movie Night</a>
        )}
        {/* The five labels sum wider than the smallest phones can hold on one
            line, so break 3 + 2 there — two spread rows, never an orphan. */}
        <span aria-hidden className="hidden w-full max-[389px]:block" />
        <a href="#about" onClick={goToSection} className="hover:text-rust">About</a>
        <a href="#contact" onClick={goToSection} className="hover:text-rust">Contact</a>
      </nav>
    </header>
  );
}
