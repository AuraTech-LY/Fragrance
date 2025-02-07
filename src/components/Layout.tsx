import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'nav-scrolled glossy-card' : 'nav-default bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-3xl font-cormorant font-bold">FRAGRANCE</Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="nav-link font-inter text-sm tracking-wide">Home</Link>
              <Link to="/shop" className="nav-link font-inter text-sm tracking-wide">Collections</Link>
              <Link to="/new-arrivals" className="nav-link font-inter text-sm tracking-wide">New Arrivals</Link>
              <Link to="/about" className="nav-link font-inter text-sm tracking-wide">About Us</Link>
              <Link to="/contact" className="nav-link font-inter text-sm tracking-wide">Contact</Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden rounded-full w-10 h-10 flex items-center justify-center border border-stone-200" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glossy-card rounded-3xl mx-4 mt-2">
              <Link to="/" className="block px-6 py-3 text-base font-medium nav-link rounded-full hover:bg-white/50">Home</Link>
              <Link to="/shop" className="block px-6 py-3 text-base font-medium nav-link rounded-full hover:bg-white/50">Collections</Link>
              <Link to="/new-arrivals" className="block px-6 py-3 text-base font-medium nav-link rounded-full hover:bg-white/50">New Arrivals</Link>
              <Link to="/about" className="block px-6 py-3 text-base font-medium nav-link rounded-full hover:bg-white/50">About Us</Link>
              <Link to="/contact" className="block px-6 py-3 text-base font-medium nav-link rounded-full hover:bg-white/50">Contact</Link>
            </div>
          </div>
        )}
      </nav>

      <Outlet />

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-16 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-cormorant text-2xl mb-6">FRAGRANCE</h4>
            <p className="text-stone-400 text-sm">
              Crafting exceptional fragrances that capture moments and memories.
            </p>
          </div>
          
          <div>
            <h5 className="font-cormorant text-xl mb-4">Contact</h5>
            <div className="space-y-4 text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin size={18} />
                123 Luxury Lane, Paris
              </p>
              <p className="flex items-center gap-2">
                <Phone size={18} />
                +33 1 23 45 67 89
              </p>
              <p className="flex items-center gap-2">
                <Mail size={18} />
                contact@fragrance.com
              </p>
            </div>
          </div>

          <div>
            <h5 className="font-cormorant text-xl mb-4">Quick Links</h5>
            <div className="space-y-2 text-stone-400">
              {['FAQ', 'Shipping', 'Returns', 'Privacy Policy'].map((link) => (
                <p key={link} className="hover:text-white cursor-pointer">
                  {link}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-cormorant text-xl mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <div className="social-icon">
                <Instagram size={20} />
              </div>
              <div className="social-icon">
                <Facebook size={20} />
              </div>
              <div className="social-icon">
                <Twitter size={20} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}