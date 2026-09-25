import Postcard from "./Postcard";
import { photos } from "@/lib/photos";

export default function About() {
  const portrait = photos[4];
  return (
    <section id="about" className="flex flex-wrap gap-14 border-t-2 border-ink px-6 py-16 md:px-14">
      <div className="flex flex-[2] basis-[420px] max-w-xl flex-col justify-center gap-4">
        <h2 className="font-display text-3xl md:text-4xl">The Photographer</h2>
        <p className="leading-relaxed text-inkfaint">
          [YOUR BIO — where you're from, how long you've been shooting, and what you're chasing: editorial fashion, quiet portraits, or a place you can't stop photographing.] Based in Miami, often somewhere else.
        </p>
      </div>
      <div className="w-full max-w-[260px] rotate-2">
        <Postcard photo={portrait} />
      </div>
    </section>
  );
}
