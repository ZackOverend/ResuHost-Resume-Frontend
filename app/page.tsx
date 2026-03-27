import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BulletDemo from "@/components/home/BulletDemo";
import Features from "@/components/home/Features";
import CtaStrip from "@/components/home/CtaStrip";
import GlowOrbs from "@/components/home/GlowOrbs";

const Home = () => (
  <div className="text-slate-400 min-h-screen font-sans relative z-1">
    <GlowOrbs />
    <Navbar />
    <Hero />
    <BulletDemo />
    <Features />
    <CtaStrip />
    <Footer />
  </div>
);

export default Home;
