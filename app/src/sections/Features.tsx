import { useEffect, useRef, useState } from 'react';
import { 
  UserCircle, 
  FileText, 
  CalendarCheck, 
  DollarSign, 
  Heart,
  Sparkles,
  MessageSquare,
  Target
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: UserCircle,
    title: 'Personalized Guidance',
    description: 'AI that learns your unique story, strengths, and aspirations to provide tailored college recommendations.',
    color: 'purple',
    size: 'large',
  },
  {
    icon: FileText,
    title: 'Essay Support',
    description: 'Brainstorm, draft, and refine your essays with AI-powered feedback that helps your authentic voice shine.',
    color: 'teal',
    size: 'tall',
  },
  {
    icon: CalendarCheck,
    title: 'Application Tracking',
    description: 'Never miss a deadline with smart reminders and progress tracking for all your applications.',
    color: 'white',
    size: 'standard',
  },
  {
    icon: DollarSign,
    title: 'Financial Aid Help',
    description: 'Navigate FAFSA, scholarships, and financial aid packages to make college affordable.',
    color: 'white',
    size: 'standard',
  },
  {
    icon: Heart,
    title: 'Mental Wellness',
    description: 'Stress management tips and encouragement to keep you healthy throughout the application journey.',
    color: 'lavender',
    size: 'wide',
  },
];

const colorClasses: Record<string, { bg: string; icon: string; hover: string }> = {
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    icon: 'text-white',
    hover: 'hover:shadow-purple-500/30',
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-500 to-teal-600',
    icon: 'text-white',
    hover: 'hover:shadow-teal-500/30',
  },
  white: {
    bg: 'bg-white border border-gray-100',
    icon: 'text-purple-600',
    hover: 'hover:shadow-xl',
  },
  lavender: {
    bg: 'bg-gradient-to-br from-lavender-100 to-purple-50',
    icon: 'text-purple-600',
    hover: 'hover:shadow-purple-500/20',
  },
};

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotateX: 90, opacity: 0, y: 50 },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });

    setHoveredCard(index);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
    setHoveredCard(null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-white to-gray-50"
      style={{ perspective: '1000px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Everything You Need
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy-900 mb-4">
            Your Complete College{' '}
            <span className="text-gradient">Success Toolkit</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From discovering your dream schools to submitting polished applications, 
            our AI counselor guides you every step of the way.
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className={`feature-card relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${colors.bg} ${colors.hover} ${
                  feature.size === 'large'
                    ? 'md:col-span-2 lg:col-span-1 lg:row-span-2'
                    : feature.size === 'tall'
                    ? 'lg:row-span-2'
                    : feature.size === 'wide'
                    ? 'md:col-span-2'
                    : ''
                }`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  boxShadow: hoveredCard === index ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : undefined,
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Glare Effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: hoveredCard === index
                      ? 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.1) 50%, transparent 54%)'
                      : undefined,
                    opacity: hoveredCard === index ? 1 : 0,
                  }}
                />

                {/* Icon */}
                <div className={`mb-4 ${feature.color === 'white' || feature.color === 'lavender' ? 'bg-purple-100' : 'bg-white/20'} w-14 h-14 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-3 ${feature.color === 'purple' || feature.color === 'teal' ? 'text-white' : 'text-navy-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feature.color === 'purple' || feature.color === 'teal' ? 'text-white/80' : 'text-gray-600'}`}>
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 opacity-20">
                  <MessageSquare className={`w-6 h-6 ${feature.color === 'purple' || feature.color === 'teal' ? 'text-white' : 'text-purple-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-500" />
              <span className="text-sm font-medium text-navy-700">
                94% of our students get into at least one of their top 3 schools
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
