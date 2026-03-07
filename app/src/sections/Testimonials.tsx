import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: 'Priya Sharma',
    school: 'Harvard University',
    year: 'Class of 2028',
    image: '/testimonial-1.jpg',
    quote: 'As a first-generation student, I had no idea where to start. My AI counselor guided me through every step, from choosing schools to writing essays that truly reflected my story.',
    rating: 5,
    highlight: 'First-gen success story',
  },
  {
    name: 'Jordan Williams',
    school: 'Stanford University',
    year: 'Class of 2027',
    image: '/testimonial-2.jpg',
    quote: 'The essay feedback was incredible. It helped me find my authentic voice and write about experiences I never thought mattered. Got into my dream school!',
    rating: 5,
    highlight: 'Essay excellence',
  },
  {
    name: 'Ethan Mitchell',
    school: 'MIT',
    year: 'Class of 2028',
    image: '/testimonial-3.jpg',
    quote: 'The deadline reminders saved me! I was juggling so many applications, and my AI counselor kept me on track without the stress.',
    rating: 5,
    highlight: 'Stress-free process',
  },
  {
    name: 'Layla Hassan',
    school: 'Yale University',
    year: 'Class of 2027',
    image: '/testimonial-4.jpg',
    quote: 'I was so nervous about interviews. The practice sessions and personalized tips gave me the confidence to shine. Forever grateful!',
    rating: 5,
    highlight: 'Interview mastery',
  },
  {
    name: 'David Chen',
    school: 'Princeton University',
    year: 'Class of 2028',
    image: '/testimonial-5.jpg',
    quote: 'The financial aid guidance was a game-changer. My family was worried about costs, but we found scholarships I never knew existed.',
    rating: 5,
    highlight: 'Financial aid winner',
  },
  {
    name: 'Sofia Rodriguez',
    school: 'Columbia University',
    year: 'Class of 2027',
    image: '/testimonial-6.jpg',
    quote: 'Having someone who remembered every detail about my journey made all the difference. It felt like having a personal mentor 24/7.',
    rating: 5,
    highlight: 'Personalized support',
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for columns
      gsap.to(column1Ref.current, {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(column2Ref.current, {
        y: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Card entrance animations
      const cards = sectionRef.current?.querySelectorAll('.testimonial-card');
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const firstColumn = testimonials.filter((_, i) => i % 2 === 0);
  const secondColumn = testimonials.filter((_, i) => i % 2 !== 0);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-6">
            <Quote className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Success Stories
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy-900 mb-4">
            What Students{' '}
            <span className="text-gradient">Are Saying</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from real students who achieved their college dreams 
            with personalized AI guidance.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Column 1 */}
          <div ref={column1Ref} className="space-y-6 lg:space-y-8">
            {firstColumn.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>

          {/* Column 2 - Offset */}
          <div ref={column2Ref} className="space-y-6 lg:space-y-8 md:mt-12">
            {secondColumn.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10,000+', label: 'Students Helped' },
            { value: '94%', label: 'Top 3 School Rate' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '50+', label: 'Countries Served' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <p className="text-2xl sm:text-3xl font-bold text-gradient mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  testimonial: {
    name: string;
    school: string;
    year: string;
    image: string;
    quote: string;
    rating: number;
    highlight: string;
  };
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="testimonial-card group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      {/* Highlight Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-50 to-teal-50 rounded-full mb-4">
        <Star className="w-3 h-3 text-purple-500" />
        <span className="text-xs font-medium text-navy-700">
          {testimonial.highlight}
        </span>
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed mb-6 relative">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-100 -z-10" />
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover group-hover:rotate-6 transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-navy-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">
            {testimonial.school} · {testimonial.year}
          </p>
        </div>
        <div className="flex gap-0.5">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
