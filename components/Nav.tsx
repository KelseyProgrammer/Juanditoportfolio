export default function Nav() {
  return (
    <header className="flex items-center justify-between border-b-2 border-ink px-6 py-6 md:px-14">
      <a href="#" className="font-display text-2xl">Juandito</a>
      <nav className="flex gap-6 font-stamp text-xs uppercase tracking-[0.14em] md:gap-9">
        <a href="#wall" className="hover:text-rust">Work</a>
        <a href="#about" className="hover:text-rust">About</a>
        <a href="#contact" className="hover:text-rust">Contact</a>
      </nav>
    </header>
  );
}
