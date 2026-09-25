import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import PostcardWall from "@/components/PostcardWall";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <Nav />
      <Hero />
      <PostcardWall />
      <About />
      <Contact />
    </main>
  );
}
