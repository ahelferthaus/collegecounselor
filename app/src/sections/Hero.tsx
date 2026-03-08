import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, MessageCircle, Calendar, BookOpen } from 'lucide-react';
import gsap from 'gsap';
import { useWaitlist } from '@/context/WaitlistContext';

const reviewCards = [
  {
    name: 'Sarah L.',
    school: 'Harvard \'28',
    image: '/review-1.jpg',
    quote: 'Got into my dream school!',
    rating: 5,
  },
  {
    name: 'Marcus T.',
    school: 'Stanford \'27',
    image: '/review-2.jpg',
    quote: 'The essay help was incredible',
    rating: 5,
  },
  {
    name: 'Elena R.',
    school: 'MIT \'28',
    image: '/review-3.jpg',
    quote: 'Made the process so smooth',
    rating: 5,
  },
];

export function Hero() {
  const { openWaitlist } = useWaitlist();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - split word stagger
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'expo.out' }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'expo.out' }
      );

      // CTA button animation
      gsap.fromTo(
        ctaRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.6, ease: 'back.out(1.7)' }
      );

      // Hero image mask reveal
      gsap.fromTo(
        imageRef.current,
        { clipPath: 'inset(100% 0 0 0)', scale: 1.2 },
        { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.2, ease: 'expo.out' }
      );

      // Review cards orbit entry
      const cards = cardsRef.current?.querySelectorAll('.review-card');
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotate: -15, scale: 0, opacity: 0 },
          {
            rotate: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.8 + i * 0.15,
            ease: 'back.out(1.7)',
          }
        );
      });

      // Blobs animation
      const blobs = blobsRef.current?.querySelectorAll('.blob');
      blobs?.forEach((blob, i) => {
        gsap.to(blob, {
          x: `random(-30, 30)`,
          y: `random(-30, 30)`,
          duration: 8 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse move effect for 3D tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateX = (e.clientY - centerY) / 50;
      const rotateY = (centerX - e.clientX) / 50;
      
      gsap.to(imageRef.current, {
        rotateX: Math.max(-5, Math.min(5, rotateX)),
        rotateY: Math.max(-5, Math.min(5, rotateY)),
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-beige-50 via-white to-lavender-50"
      style={{ perspective: '1000px' }}
    >
      {/* Animated Background Blobs */}
      <div ref={blobsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute -top-40 -left-40 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="blob absolute top-1/3 -right-40 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />
        <div className="blob absolute -bottom-20 left-1/4 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237F56D9' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-8rem)]">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full w-fit">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm font-medium text-purple-700">
                AI-Powered College Guidance
              </span>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-navy-900 leading-tight"
            >
              Your Personal{' '}
              <span className="text-gradient">AI College</span>{' '}
              Counselor
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl text-gray-600 max-w-xl leading-relaxed"
            >
              Guiding you to your dream school with personalized advice, essay help, 
              and application tracking. Like having a dedicated counselor who never 
              forgets your story.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={openWaitlist}
                className="bg-gradient-purple-teal text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/25"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={openWaitlist}
                className="border-2 border-navy-200 text-navy-700 hover:bg-navy-50 px-8 py-6 text-lg font-semibold rounded-xl"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with AI
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {reviewCards.map((review, i) => (
                  <img
                    key={i}
                    src={review.image}
                    alt={review.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-navy-900">4.9/5</span>
                </div>
                <p className="text-sm text-gray-500">Loved by 10,000+ students</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy-900">98%</p>
                  <p className="text-xs text-gray-500">Deadline Success</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy-900">50K+</p>
                  <p className="text-xs text-gray-500">Essays Reviewed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image with Review Cards */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main Image */}
            <div
              ref={imageRef}
              className="relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative w-72 sm:w-80 lg:w-96 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20">
                <img
                  src="/hero-student.jpg"
                  alt="Student with notebook"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
              </div>

              {/* Floating Review Cards */}
              <div ref={cardsRef} className="absolute inset-0 pointer-events-none">
                {reviewCards.map((review, i) => (
                  <div
                    key={i}
                    className="review-card absolute pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl hover:z-20"
                    style={{
                      ...(
                        i === 0
                          ? { top: '10%', left: '-20%' }
                          : i === 1
                          ? { top: '40%', right: '-25%' }
                          : { bottom: '15%', left: '-15%' }
                      ),
                      animation: `float ${4 + i * 0.5}s ease-in-out infinite ${i * 0.5}s`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-navy-900">{review.name}</p>
                        <p className="text-[10px] text-gray-500">{review.school}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 italic">"{review.quote}"</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-teal-100 rounded-full opacity-60 animate-pulse-soft" />
            <div className="absolute bottom-20 left-10 w-16 h-16 bg-purple-100 rounded-full opacity-60 animate-pulse-soft" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
