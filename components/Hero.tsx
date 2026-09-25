import Postcard from "./Postcard";
import { heroPhoto } from "@/lib/photos";

/** Hand-drawn cancellation mark: double-ring Miami postmark + wavy killer bars. */
function Postmark() {
  return (
    <svg
      viewBox="0 0 118 44"
      aria-hidden
      className="-rotate-6 h-auto w-[150px] shrink-0 text-rust md:w-[200px]"
    >
      <g fill="none" stroke="currentColor">
        <circle cx="22" cy="22" r="20.5" strokeWidth="1.4" />
        <circle cx="22" cy="22" r="16" strokeWidth="0.7" opacity="0.8" />
      </g>
      <g fill="currentColor" fontFamily="var(--font-stamp), monospace" textAnchor="middle">
        <text x="22" y="17.5" fontSize="5.4" letterSpacing="0.6">MIAMI, FLA</text>
        <text x="22" y="25" fontSize="4.6" letterSpacing="1.4">PAR AVION</text>
        <text x="22" y="32.5" fontSize="4.6" letterSpacing="0.6">USA</text>
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        <path d="M50 13 c5 -3.5 9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0" />
        <path d="M50 22 c5 -3.5 9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0" />
        <path d="M50 31 c5 -3.5 9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0" />
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="flex flex-wrap items-center gap-12 px-6 pb-16 pt-20 md:px-14">
      <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-5">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Postmark />
          <p className="font-stamp text-base uppercase tracking-[0.18em] text-rust md:text-xl">
            Postcards from the road
          </p>
        </div>
        <h1 className="font-display text-3xl leading-[1.7] text-ink/75 sm:text-4xl sm:leading-[1.65] md:text-[2.75rem] md:leading-[1.6]">
          A photo journal,{" "}
          <br className="hidden sm:inline" />
          mailed from{" "}
          <br className="hidden sm:inline" />
          wherever the light is.
        </h1>
        <p className="max-w-md text-base leading-relaxed text-inkfaint">
          Miami-based photographer working in editorial, portrait, and travel. [YOUR TAGLINE HERE — one line on your approach.]
        </p>
      </div>
      <div className="flex min-w-0 flex-1 basis-[320px] justify-center">
        <div className="w-full max-w-[340px] -rotate-3">
          <Postcard photo={heroPhoto} />
        </div>
      </div>
    </section>
  );
}
