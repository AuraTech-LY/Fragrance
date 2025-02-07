import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
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
            <Link to="/shop" className="btn-primary inline-block">
              Shop Collection
            </Link>
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
              <Link to={`/shop/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={product.name} className="group cursor-pointer product-card">
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
              </Link>
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
    </>
  );
}