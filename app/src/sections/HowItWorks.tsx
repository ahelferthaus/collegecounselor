import { useEffect, useRef } from 'react';
import { UserPlus, MessageSquare, LineChart, Send, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Share your academic background, interests, activities, and dreams. Our AI learns what makes you unique.',
    details: ['Academic history & GPA', 'Extracurricular activities', 'Career interests', 'Personal preferences'],
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Get Personalized Advice',
    description: 'Receive tailored college recommendations, essay prompts, and strategic guidance based on your profile.',
    details: ['Best-fit college lists', 'Essay brainstorming', 'Interview prep', 'Scholarship matches'],
  },
  {
    number: '03',
    icon: LineChart,
    title: 'Track Your Progress',
    description: 'Stay organized with deadline reminders, application checklists, and progress tracking.',
    details: ['Deadline alerts', 'Document checklist', 'Application status', 'Milestone celebrations'],
  },
  {
    number: '04',
    icon: Send,
    title: 'Submit with Confidence',
    description: 'Review, refine, and submit polished applications with AI-powered feedback and support.',
    details: ['Essay reviews', 'Final checks', 'Submission guidance', 'Decision support'],
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // SVG path drawing animation
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength();
        
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        });
      }

      // Step cards animation
      const stepCards = stepsRef.current?.querySelectorAll('.step-card');
      stepCards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Number color fill animation
        const number = card.querySelector('.step-number');
        gsap.fromTo(
          number,
          { color: '#9CA3AF' },
          {
            color: '#7F56D9',
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full mb-6">
            <CheckCircle className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700">
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy-900 mb-4">
            Your Journey to{' '}
            <span className="text-gradient">College Success</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Four simple steps to transform your college application experience 
            from stressful to successful.
          </p>
        </div>

        {/* Steps with connecting line */}
        <div ref={stepsRef} className="relative">
          {/* SVG Connecting Line - Desktop only */}
          <svg
            className="absolute left-1/2 top-0 h-full w-4 -translate-x-1/2 hidden lg:block"
            viewBox="0 0 4 800"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M 2 0 L 2 800"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7F56D9" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`step-card relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`inline-flex items-center gap-3 mb-4 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                      <span className="step-number text-5xl font-bold text-gray-300 transition-colors duration-500">
                        {step.number}
                      </span>
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md">
                      {step.description}
                    </p>
                    <ul className={`space-y-2 ${isEven ? 'lg:text-right' : ''}`}>
                      {step.details.map((detail, i) => (
                        <li
                          key={i}
                          className={`inline-flex items-center gap-2 text-sm text-gray-500 ${
                            isEven ? 'lg:flex-row-reverse' : ''
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Center Node */}
                  <div className="relative flex-shrink-0 hidden lg:flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg shadow-purple-500/30 z-10">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="absolute w-24 h-24 rounded-full bg-purple-100 animate-ping opacity-20" />
                  </div>

                  {/* Illustration Placeholder */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                      {/* Abstract illustration */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4 w-20 h-20 bg-purple-300 rounded-full" />
                        <div className="absolute bottom-4 right-4 w-16 h-16 bg-teal-300 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gray-300 rounded-full" />
                      </div>
                      <Icon className="w-16 h-16 text-purple-300 group-hover:scale-110 transition-transform duration-300" />
                      
                      {/* Step indicator */}
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-medium text-gray-500">Step {index + 1} of 4</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
