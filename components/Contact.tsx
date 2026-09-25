export default function Contact() {
  return (
    <footer id="contact" className="flex flex-col gap-6 border-t-2 border-ink px-6 pb-12 pt-16 md:px-14">
      <h2 className="max-w-xl font-display text-3xl md:text-5xl">
        Wish you were here — let&apos;s plan the next shoot.
      </h2>
      <div className="flex flex-wrap gap-6">
        <a href="mailto:[YOUR EMAIL]" className="bg-ink px-6 py-3 text-sm tracking-wide text-paper hover:bg-rust">
          Email — [YOUR EMAIL]
        </a>
        <a href="https://www.instagram.com/juanditobandito" target="_blank" rel="noreferrer" className="py-3 font-stamp text-sm text-rust hover:underline">
          @juanditobandito
        </a>
      </div>
      <p className="mt-8 font-stamp text-[11px] text-inkfaint">Postmarked Miami, FL</p>
    </footer>
  );
}
