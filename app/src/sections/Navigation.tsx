import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, X, Map, UserRound } from 'lucide-react';
import { useWaitlist } from '@/context/WaitlistContext';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold font-heading text-lg transition-colors ${
                isScrolled ? 'text-navy-900' : 'text-navy-900'
              }`}>
                College Counselor AI
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                    isScrolled ? 'text-gray-600' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/map"
                className="flex items-center gap-1.5 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
              >
                <Map className="w-4 h-4" />
                Campus Map
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
              >
                <UserRound className="w-4 h-4" />
                My Profile
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={openWaitlist}
                className={`text-sm font-medium ${
                  isScrolled ? 'text-navy-700' : 'text-navy-700'
                }`}
              >
                Log In
              </Button>
              <Button
                onClick={openWaitlist}
                className="bg-gradient-purple-teal text-white hover:opacity-90 text-sm font-medium rounded-lg"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-navy-900" />
              ) : (
                <Menu className="w-6 h-6 text-navy-900" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute top-16 left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 transition-all duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="space-y-4">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-3 text-navy-700 font-medium hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/map"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 w-full text-left px-4 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors"
            >
              <Map className="w-4 h-4" />
              Campus Map
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 w-full text-left px-4 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors"
            >
              <UserRound className="w-4 h-4" />
              My Profile
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <Button
              variant="outline"
              onClick={openWaitlist}
              className="w-full justify-center"
            >
              Log In
            </Button>
            <Button
              onClick={openWaitlist}
              className="w-full justify-center bg-gradient-purple-teal text-white"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
