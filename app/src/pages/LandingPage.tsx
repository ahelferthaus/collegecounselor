import { useEffect } from 'react';
import { Navigation } from '@/sections/Navigation';
import { Hero } from '@/sections/Hero';
import { LogoMarquee } from '@/sections/LogoMarquee';
import { Features } from '@/sections/Features';
import { HowItWorks } from '@/sections/HowItWorks';
import { Testimonials } from '@/sections/Testimonials';
import { Pricing } from '@/sections/Pricing';
import { FAQ } from '@/sections/FAQ';
import { CTA } from '@/sections/CTA';
import { Footer } from '@/sections/Footer';
import { WaitlistModal } from '@/components/WaitlistModal';
import { WaitlistProvider } from '@/context/WaitlistContext';

export function LandingPage() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <WaitlistProvider>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main>
          <Hero />
          <LogoMarquee />
          <section id="features">
            <Features />
          </section>
          <section id="how-it-works">
            <HowItWorks />
          </section>
          <section id="testimonials">
            <Testimonials />
          </section>
          <section id="pricing">
            <Pricing />
          </section>
          <section id="faq">
            <FAQ />
          </section>
          <CTA />
        </main>
        <Footer />
        <WaitlistModal />
      </div>
    </WaitlistProvider>
  );
}
