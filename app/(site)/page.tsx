import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Work from '@/components/sections/Work';
import Tech from '@/components/sections/Tech';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Tech />
      <Services />
      <Testimonials />
      <Blog />
      <Contact />
    </>
  );
}
