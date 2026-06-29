import BackToTop from '../components/layout/BackToTop';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import ScrollProgress from '../components/layout/ScrollProgress';
import About from '../components/sections/About';
import CatalogSection from '../components/sections/CatalogSection';
import KeyDistributorship from '../components/sections/KeyDistributorship';
import HaMeditech from '../components/sections/HaMeditech';
import Contact from '../components/sections/Contact';
import Hero from '../components/sections/Hero';
import Industries from '../components/sections/Industries';
import Marquee from '../components/sections/Marquee';
import ProjectsPreview from '../components/sections/ProjectsPreview';
import SuccessStories from '../components/sections/SuccessStories';
import Services from '../components/sections/Services';

export default function HomePage() {  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
      <Hero />
      <Marquee />
      <About />
      <HaMeditech />
      <KeyDistributorship />
      <CatalogSection />
      <Services />
      <Industries />
      <SuccessStories />
      <ProjectsPreview />
      <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
