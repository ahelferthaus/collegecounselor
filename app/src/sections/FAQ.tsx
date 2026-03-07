import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'How is this different from a regular college counselor?',
    answer: 'Our AI counselor is available 24/7, remembers every detail about your journey, and provides instant personalized guidance. Unlike human counselors who juggle hundreds of students, our AI focuses entirely on you—your strengths, your concerns, your timeline. Plus, it\'s a fraction of the cost of traditional counseling while offering comprehensive support.',
    category: 'General',
  },
  {
    question: 'Will colleges know I used AI help for my essays?',
    answer: 'Absolutely not. Our AI acts as a collaborative partner, helping you discover and articulate your own authentic voice. We don\'t write essays for you—we guide you through brainstorming, provide feedback on your drafts, and help you polish your work. Your essays remain 100% your own words and ideas.',
    category: 'Essays',
  },
  {
    question: 'Can you help with financial aid and scholarships?',
    answer: 'Yes! Our AI helps you navigate the entire financial aid process—from completing FAFSA to finding scholarships matched to your profile. We explain complex financial aid packages in simple terms and help you identify opportunities you might have missed, including merit-based scholarships and need-based grants.',
    category: 'Financial',
  },
  {
    question: 'What if I\'m a first-generation college student?',
    answer: 'We specialize in supporting first-gen students! Our AI explains every step of the process in plain language, from understanding different types of colleges to decoding application requirements. We also provide resources to help your family understand and support your college journey. You\'re not alone in this.',
    category: 'First-Gen',
  },
  {
    question: 'How does the AI remember my story and progress?',
    answer: 'Our AI builds a comprehensive profile of your academic history, extracurricular activities, interests, and goals. Every conversation, every essay draft, every deadline is tracked. When you return, it picks up right where you left off—no need to repeat yourself. It\'s like having a counselor who never forgets a detail.',
    category: 'AI Features',
  },
  {
    question: 'Can parents access the platform too?',
    answer: 'Yes! Our Family plan includes a parent dashboard where parents can track progress, view upcoming deadlines, and access resources to support their student. We believe college applications are a team effort, and we keep everyone informed and involved.',
    category: 'Family',
  },
  {
    question: 'What if I\'m shy or introverted about sharing my story?',
    answer: 'We understand that opening up can be hard. Our AI creates a judgment-free, supportive space where you can share at your own pace. We help you identify your strengths and experiences that make you unique, even if you don\'t think they\'re "impressive." Sometimes the quietest stories have the most impact.',
    category: 'Support',
  },
  {
    question: 'How far in advance should I start?',
    answer: 'The earlier, the better! Starting in sophomore or junior year gives you time to build a strong profile, explore colleges, and craft compelling essays without stress. However, we\'ve helped seniors create successful applications in just a few months. No matter where you are in the process, we\'re here to help.',
    category: 'Timeline',
  },
];

export function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = faqsRef.current?.querySelectorAll('.faq-item');
      
      items?.forEach((item, i) => {
        gsap.fromTo(
          item,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Got Questions?
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy-900 mb-4">
            Frequently Asked{' '}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about your AI college counselor. 
            Can't find what you're looking for? Reach out to our team.
          </p>
        </div>

        {/* FAQ List */}
        <div ref={faqsRef} className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md flex-shrink-0 mt-0.5">
                    {faq.category}
                  </span>
                  <span className="font-semibold text-navy-900 pr-4">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[4.5rem] sm:pl-[5.5rem]">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-teal-50 rounded-2xl">
            <MessageCircle className="w-8 h-8 text-purple-500" />
            <div className="text-center sm:text-left">
              <p className="font-semibold text-navy-900">Still have questions?</p>
              <p className="text-sm text-gray-600">
                Our team is here to help. Chat with us or email{' '}
                <a href="mailto:support@collegecounselor.ai" className="text-purple-600 hover:underline">
                  support@collegecounselor.ai
                </a>
              </p>
            </div>
            <button className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg shadow-sm hover:shadow-md transition-shadow">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
