export default function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-2 border-ink px-6 py-6 md:px-14">
      <a href="#" className="font-display text-2xl">Juandito</a>
      <nav className="flex flex-wrap gap-4 font-stamp text-xs uppercase tracking-[0.14em] md:gap-9">
        <a href="#wall" className="hover:text-rust">Work</a>
        <a href="#darkroom" className="hover:text-rust">Darkroom</a>
        <a href="#about" className="hover:text-rust">About</a>
        <a href="#contact" className="hover:text-rust">Contact</a>
      </nav>
    </header>
  );
}
