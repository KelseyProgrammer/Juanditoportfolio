import Postcard from "./Postcard";
import { photos } from "@/lib/photos";

export default function Hero() {
  const hero = photos.find((p) => p.id === "tenerife") ?? photos[0];
  return (
    <section className="flex flex-wrap items-center gap-12 px-6 pb-16 pt-20 md:px-14">
      <div className="flex flex-1 basis-[420px] flex-col gap-5">
        <p className="font-stamp text-[13px] uppercase tracking-[0.15em] text-rust">Postcards from the road</p>
        <h1 className="font-display text-5xl leading-[1.02] md:text-7xl">
          A photo journal,<br />mailed from<br />wherever the light is.
        </h1>
        <p className="max-w-md text-base leading-relaxed text-inkfaint">
          Miami-based photographer working in editorial, portrait, and travel. [YOUR TAGLINE HERE — one line on your approach.]
        </p>
      </div>
      <div className="flex flex-1 basis-[320px] justify-center">
        <div className="w-full max-w-[340px] -rotate-3">
          <Postcard photo={hero} />
        </div>
      </div>
    </section>
  );
}
