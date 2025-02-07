import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

function App() {
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
            <h1 className="text-3xl font-cormorant font-bold">FRAGRANCE</h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {['Home', 'Collections', 'New Arrivals', 'About Us', 'Contact'].map((item) => (
                <a key={item} href="#" className="nav-link font-inter text-sm tracking-wide">
                  {item}
                </a>
              ))}
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
              {['Home', 'Collections', 'New Arrivals', 'About Us', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-6 py-3 text-base font-medium nav-link rounded-full hover:bg-white/50"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80"
            alt="Luxury perfume bottles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl glossy-card p-12 rounded-3xl">
            <h2 className="text-6xl font-cormorant font-light mb-6">
              Discover Your Signature Scent
            </h2>
            <p className="text-lg mb-8 font-inter font-light">
              Explore our curated collection of luxury fragrances, each telling its own unique story.
            </p>
            <button className="btn-primary">
              Shop Collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-cormorant text-center mb-16">Featured Collections</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "L'Essence du Printemps",
                image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80",
                price: "$285"
              },
              {
                name: "Nuit Mystérieuse",
                image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80",
                price: "$320"
              },
              {
                name: "Jardin Secret",
                image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80",
                price: "$295"
              }
            ].map((product) => (
              <div key={product.name} className="group cursor-pointer product-card">
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-cormorant text-xl">{product.name}</h4>
                  <p className="text-gold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="glossy-card p-12 rounded-3xl">
            <h3 className="text-4xl font-cormorant mb-6">Join Our World</h3>
            <p className="mb-8 text-stone-600">
              Subscribe to receive exclusive updates, early access to new collections, and personalized fragrance recommendations.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

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

export default App;