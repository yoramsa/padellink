import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Counters from "@/components/Counters";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import FrenchSection from "@/components/FrenchSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Counters />
        <Services />
        <Process />
        <Projects />
        <FrenchSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
