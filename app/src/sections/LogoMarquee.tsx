import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const universities = [
  { name: 'Harvard', abbr: 'H' },
  { name: 'Stanford', abbr: 'S' },
  { name: 'MIT', abbr: 'M' },
  { name: 'Yale', abbr: 'Y' },
  { name: 'Princeton', abbr: 'P' },
  { name: 'Columbia', abbr: 'C' },
  { name: 'Brown', abbr: 'B' },
  { name: 'Dartmouth', abbr: 'D' },
];

export function LogoMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll velocity skew effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const skewAmount = Math.min(Math.max(velocity / 300, -10), 10);
          gsap.to(trackRef.current, {
            skewX: skewAmount,
            duration: 0.3,
            ease: 'power2.out',
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 bg-white overflow-hidden border-y border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
          Trusted by students accepted to
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling Track */}
        <div
          ref={trackRef}
          className="flex gap-16 animate-marquee hover:[animation-play-state:paused]"
          style={{
            animation: 'marquee 30s linear infinite',
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...universities, ...universities].map((uni, i) => (
            <div
              key={i}
              className="flex items-center gap-3 flex-shrink-0 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-300">
                {uni.abbr}
              </div>
              <span className="text-lg font-semibold text-gray-400 group-hover:text-navy-700 transition-colors duration-300">
                {uni.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
