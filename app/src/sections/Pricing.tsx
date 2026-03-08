import { useEffect, useRef, useState } from 'react';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useWaitlist } from '@/context/WaitlistContext';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Starter',
    icon: Sparkles,
    description: 'Perfect for exploring your options',
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: 'gray',
    features: [
      { text: 'Basic college search', included: true },
      { text: '5 essay reviews per month', included: true },
      { text: 'Application deadline tracker', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced AI personalization', included: false },
      { text: 'Interview preparation', included: false },
      { text: 'Financial aid guidance', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Zap,
    description: 'For serious applicants',
    monthlyPrice: 29,
    yearlyPrice: 290,
    color: 'purple',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Unlimited essay reviews', included: true },
      { text: 'Advanced AI personalization', included: true },
      { text: 'Interview preparation', included: true },
      { text: 'Financial aid guidance', included: true },
      { text: 'Scholarship matcher', included: true },
      { text: '24/7 chat support', included: true },
      { text: 'Parent dashboard', included: false },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Family',
    icon: Crown,
    description: 'Complete family support',
    monthlyPrice: 49,
    yearlyPrice: 490,
    color: 'teal',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Up to 3 student profiles', included: true },
      { text: 'Parent dashboard', included: true },
      { text: 'Family consultation calls', included: true },
      { text: 'College visit planner', included: true },
      { text: 'Application strategy sessions', included: true },
      { text: 'Dedicated success manager', included: true },
      { text: 'White-glove support', included: true },
    ],
    cta: 'Choose Family Plan',
    popular: false,
  },
];

export function Pricing() {
  const { openWaitlist } = useWaitlist();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [isYearly, setIsYearly] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.pricing-card');
      
      cards?.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.15,
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

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-50 to-transparent rounded-full opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full mb-6">
            <Crown className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-teal-700">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-navy-900 mb-4">
            Choose Your{' '}
            <span className="text-gradient">Path to Success</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Affordable plans designed to fit every student's needs. 
            Invest in your future today.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-navy-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-purple-600"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-navy-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-8 lg:gap-6"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            
            return (
              <div
                key={index}
                className={`pricing-card relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl shadow-purple-500/25 scale-105 z-10'
                    : 'bg-white border border-gray-100 hover:shadow-xl hover:border-purple-100'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-semibold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    plan.popular ? 'bg-white/20' : plan.color === 'gray' ? 'bg-gray-100' : plan.color === 'purple' ? 'bg-purple-100' : 'bg-teal-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      plan.popular ? 'text-white' : plan.color === 'gray' ? 'text-gray-600' : plan.color === 'purple' ? 'text-purple-600' : 'text-teal-600'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-navy-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-navy-900'}`}>
                      ${price}
                    </span>
                    <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {isYearly && price > 0 && (
                    <p className={`text-xs mt-1 ${plan.popular ? 'text-white/60' : 'text-gray-400'}`}>
                      Billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-white' : 'text-green-500'
                        }`} />
                      ) : (
                        <X className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-white/40' : 'text-gray-300'
                        }`} />
                      )}
                      <span className={`text-sm ${
                        feature.included
                          ? plan.popular ? 'text-white' : 'text-gray-700'
                          : plan.popular ? 'text-white/40' : 'text-gray-400'
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={openWaitlist}
                  className={`w-full py-6 font-semibold rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : plan.color === 'purple'
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : plan.color === 'teal'
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>No credit card required for free plan</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>7-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
