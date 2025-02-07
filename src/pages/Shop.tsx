import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Perfume } from '../types/perfume';

const CATEGORIES = ["All", "Floral", "Oriental", "Fresh", "Woody"];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPerfumes(data || []);
    } catch (err) {
      console.error('Error fetching perfumes:', err);
      setError('Failed to load perfumes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPerfumes = perfumes.filter(perfume => {
    const matchesCategory = selectedCategory === "All" || perfume.category === selectedCategory;
    const matchesSearch = perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         perfume.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-cormorant mb-4">Our Collection</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Discover our curated selection of luxury fragrances, each carefully crafted to tell a unique story.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search fragrances..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-stone-200 focus:border-stone-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200"
            >
              <Filter size={20} />
              Filters
            </button>
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex gap-2 flex-wrap`}>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-stone-800 text-white'
                      : 'bg-white border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPerfumes.map(perfume => (
              <div key={perfume.id} className="group product-card">
                <div className="relative overflow-hidden rounded-3xl" style={{ height: '400px' }}>
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-cormorant text-xl mb-1">{perfume.name}</h3>
                      <p className="text-sm text-stone-500">{perfume.category}</p>
                    </div>
                    <p className="text-gold font-medium">${perfume.price}</p>
                  </div>
                  <p className="text-stone-600 text-sm mb-4">{perfume.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {perfume.notes.map(note => (
                      <span key={note} className="text-xs px-3 py-1 rounded-full bg-stone-100">
                        {note}
                      </span>
                    ))}
                  </div>
                  <button className="w-full btn-primary mt-6">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredPerfumes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-600">No perfumes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}