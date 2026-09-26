import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import PostcardWall from "@/components/PostcardWall";
import Darkroom from "@/components/Darkroom";
import About from "@/components/About";
import Contact from "@/components/Contact";
import BackToTop from "@/components/BackToTop";
import ApertureCursor from "@/components/ApertureCursor";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Nav />
      <Hero />
      <PostcardWall />
      <Darkroom />
      <About />
      <Contact />
      <BackToTop />
      <ApertureCursor />
    </main>
  );
}
