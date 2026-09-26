import Postcard from "./Postcard";
import { contactPhoto } from "@/lib/photos";

export default function Contact() {
  return (
    <footer id="contact" className="flex flex-wrap items-center gap-12 border-t-2 border-ink px-6 pb-12 pt-16 md:px-14">
      <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-6">
        <h2 className="max-w-xl font-display text-3xl leading-[1.6] text-ink/75 md:text-4xl">
          Wish you were here — let&apos;s plan the next shoot.
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <a href="mailto:Juanherrep@yahoo.com" className="bg-ink px-6 py-3 text-sm tracking-wide text-paper hover:bg-rust">
            Email — Juanherrep@yahoo.com
          </a>
          <a href="https://www.instagram.com/juanditobandito" target="_blank" rel="noreferrer" className="py-3 font-stamp text-sm text-rust hover:underline">
            @juanditobandito
          </a>
        </div>
        <p className="mt-8 font-stamp text-[11px] text-inkfaint">Postmarked Miami, FL</p>
      </div>
      <div className="flex min-w-0 flex-1 basis-[240px] justify-center md:justify-end">
        <div className="w-full max-w-[250px] rotate-2">
          <Postcard photo={contactPhoto} />
        </div>
      </div>
    </footer>
  );
}
