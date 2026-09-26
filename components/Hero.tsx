import Image from "next/image";
import Postcard from "./Postcard";
import { heroPhoto } from "@/lib/photos";

/**
 * Hand-drawn postal vignette: a perforated sun-and-sea stamp, cancelled by
 * the double-ring Miami postmark whose wavy killer bars strike across it.
 */
function Postmark() {
  return (
    <svg
      viewBox="0 0 152 46"
      aria-hidden
      className="-rotate-6 h-auto w-[190px] shrink-0 text-rust md:w-[250px]"
    >
      <g fill="none" stroke="currentColor">
        <circle cx="22" cy="23" r="20.5" strokeWidth="1.4" />
        <circle cx="22" cy="23" r="16" strokeWidth="0.7" opacity="0.8" />
      </g>
      <g fill="currentColor" fontFamily="var(--font-stamp), monospace" textAnchor="middle">
        <text x="22" y="18.5" fontSize="5.4" letterSpacing="0.6">MIAMI, FLA</text>
        <text x="22" y="26" fontSize="4.6" letterSpacing="1.4">PAR AVION</text>
        <text x="22" y="33.5" fontSize="4.6" letterSpacing="0.6">USA</text>
      </g>

      {/* postage stamp: perforated edge, sun over water, cancelled by the bars */}
      <g transform="translate(103 3) rotate(2 19 20)">
        <rect x="0" y="0" width="38" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="0.1 3.2" />
        <rect x="4.5" y="4.5" width="29" height="31" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="19" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
          <path d="M19 7.5 v2.5" />
          <path d="M11.5 9.5 l1.8 1.8" />
          <path d="M26.5 9.5 l-1.8 1.8" />
          <path d="M9 16 h2.5" />
          <path d="M26.5 16 h2.5" />
        </g>
        <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round">
          <path d="M8.5 25 c2 -1.6 4 1.6 6 0 s4 1.6 6 0 s4 1.6 6 0" />
          <path d="M8.5 28.5 c2 -1.6 4 1.6 6 0 s4 1.6 6 0 s4 1.6 6 0" />
        </g>
        <text x="19" y="34" fontSize="3.6" letterSpacing="0.8" fill="currentColor" fontFamily="var(--font-stamp), monospace" textAnchor="middle">USA · 44</text>
      </g>

      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        <path d="M50 14 c5 -3.5 9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0" />
        <path d="M50 23 c5 -3.5 9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0" />
        <path d="M50 32 c5 -3.5 9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0 s9 3.5 14 0" />
      </g>
    </svg>
  );
}

/** A matted print peeking out from the mail pile behind the hero postcard. */
function PilePrint({ src, className }: { src: string; className: string }) {
  return (
    <div aria-hidden className={`absolute w-[82%] ${className}`}>
      <div className="bg-white p-2 pb-7 shadow-postcard">
        <div className="relative aspect-[2/3] overflow-hidden bg-sand/30">
          <Image src={src} alt="" fill sizes="30vw" draggable={false} className="object-cover object-[50%_20%]" />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex flex-wrap items-center gap-12 overflow-hidden px-6 pb-16 pt-20 md:px-14">
      {/* light leak — a warm wash bleeding in from the top right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 55% at 88% 0%, rgba(201,138,74,0.28), rgba(201,138,74,0.08) 55%, transparent 75%)"
        }}
      />

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

      {/* the mail pile: two prints fanned out behind the postcard on top */}
      <div className="flex min-w-0 flex-1 basis-[320px] justify-center">
        <div className="relative w-full max-w-[340px]">
          <PilePrint src="/photos/maile0203.jpg" className="left-[-10%] top-[4%] -rotate-[11deg]" />
          <PilePrint src="/photos/look-0331.jpg" className="right-[-9%] top-[1%] rotate-[9deg]" />
          <div className="relative -rotate-3">
            <Postcard photo={heroPhoto} />
          </div>
        </div>
      </div>
    </section>
  );
}
