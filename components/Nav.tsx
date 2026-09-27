import { videos } from "@/lib/videos";

export default function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-ink px-6 py-6 md:px-14">
      <a href="#" className="font-display text-2xl">Juandito Bandito</a>
      {/* Phones: the links take their own full row under the signature and
          spread edge to edge — one deliberate ruled index line instead of a
          ragged wrap. 11px is the stamp voice's floor (see DESIGN.md). */}
      <nav className="flex w-full flex-wrap justify-between gap-x-3 gap-y-2 font-stamp text-[11px] uppercase tracking-[0.14em] sm:w-auto sm:justify-normal sm:gap-4 sm:text-xs md:gap-9">
        <a href="#wall" className="hover:text-rust">Work</a>
        <a href="#darkroom" className="hover:text-rust">Darkroom</a>
        {videos.length > 0 && (
          <a href="#movie-night" className="whitespace-nowrap hover:text-rust">Movie Night</a>
        )}
        {/* The five labels sum wider than the smallest phones can hold on one
            line, so break 3 + 2 there — two spread rows, never an orphan. */}
        <span aria-hidden className="hidden w-full max-[389px]:block" />
        <a href="#about" className="hover:text-rust">About</a>
        <a href="#contact" className="hover:text-rust">Contact</a>
      </nav>
    </header>
  );
}
