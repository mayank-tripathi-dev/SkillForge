import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { Course } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? searchParams.get('category')!.split(',') : ['Development', 'Design']
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['Intermediate', 'Advanced']);
  const [priceTier, setPriceTier] = useState<'all' | 'paid' | 'free'>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategories.length > 0) params.category = selectedCategories.join(',');
      if (selectedLevels.length > 0) params.level = selectedLevels.join(',');
      if (priceTier !== 'all') params.price = priceTier;
      if (sortBy) params.sort = sortBy;

      const res = await API.get('/courses', { params });
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategories, selectedLevels, priceTier, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleLevel = (lvl: string) => {
    setSelectedLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceTier('all');
    setSearchQuery('');
    setSortBy('popular');
  };

  return (
    <div className="w-full">
      {/* Page Header & Hero Lead */}
      <section className="mb-10 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-subtle border border-border-subtle mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-glow-mint animate-pulse"></span>
            <span className="font-code text-xs text-text-secondary">Explore 3,400+ Verified Curriculums</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight font-body">
            Explore Courses
          </h1>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Discover practical, project-based courses taught by industry veterans and principal engineers.
          </p>
        </div>

        {/* Search & Sorting Control Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-surface-base border border-border-subtle rounded-xl shadow-xs">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
            <div className="flex items-center gap-2.5 flex-1 bg-surface-subtle border border-border-subtle rounded-lg px-3.5 h-10 focus-ring transition-all">
              <Search className="w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, framework, or instructor name..."
                className="bg-transparent border-0 p-0 text-xs text-text-primary placeholder:text-text-tertiary focus:ring-0 w-full"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <span className="hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-subtle border border-border-subtle rounded-lg h-10 px-3 text-xs text-text-primary focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Layout: Sidebar + Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 space-y-6 sticky top-24">
          {/* Category Filter */}
          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
              <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Categories</h2>
              <button
                onClick={resetFilters}
                className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="space-y-2">
              {['Development', 'Design', 'Business', 'Marketing', 'IT & Software'].map((cat) => (
                <label key={cat} className="flex items-center justify-between cursor-pointer group py-1">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 rounded text-primary focus:ring-0 border-border-strong cursor-pointer"
                    />
                    <span className="text-xs text-text-primary group-hover:text-primary transition-colors">
                      {cat}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider pb-3 border-b border-border-subtle mb-3">
              Level
            </h2>
            <div className="space-y-2">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <label key={lvl} className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(lvl)}
                    onChange={() => toggleLevel(lvl)}
                    className="w-4 h-4 rounded text-primary focus:ring-0 border-border-strong cursor-pointer"
                  />
                  <span className="text-xs text-text-primary">{lvl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="bg-surface-base border border-border-subtle rounded-xl p-4 shadow-xs">
            <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider pb-3 border-b border-border-subtle mb-3">
              Price
            </h2>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setPriceTier('all')}
                className={`py-1.5 text-xs font-medium rounded-lg text-center transition-colors ${
                  priceTier === 'all'
                    ? 'bg-primary text-white border border-primary'
                    : 'bg-surface-subtle border border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriceTier('paid')}
                className={`py-1.5 text-xs font-medium rounded-lg text-center transition-colors ${
                  priceTier === 'paid'
                    ? 'bg-primary text-white border border-primary'
                    : 'bg-surface-subtle border border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => setPriceTier('free')}
                className={`py-1.5 text-xs font-medium rounded-lg text-center transition-colors ${
                  priceTier === 'free'
                    ? 'bg-primary text-white border border-primary'
                    : 'bg-surface-subtle border border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                Free
              </button>
            </div>
          </div>
        </aside>

        {/* Course Grid Area */}
        <section className="md:col-span-9">
          {/* Results stats bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-text-secondary">
              Showing <span className="font-medium text-text-primary">{courses.length}</span> curated courses
            </p>
            {selectedCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-code text-[11px] text-text-tertiary">Active Filter:</span>
                <span className="inline-flex items-center gap-1.5 bg-surface-subtle border border-border-subtle px-2.5 py-1 rounded-md text-xs text-text-primary">
                  {selectedCategories.join(', ')}
                  <button onClick={() => setSelectedCategories([])} className="text-text-tertiary hover:text-text-primary">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-surface-base border border-border-subtle rounded-xl p-4 h-80 animate-pulse flex flex-col justify-between">
                  <div className="bg-surface-muted aspect-video rounded-lg w-full mb-3" />
                  <div className="h-4 bg-surface-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-surface-muted rounded w-1/2" />
                  <div className="h-10 bg-surface-muted rounded w-full mt-4" />
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="bg-surface-base border border-border-subtle rounded-xl p-12 text-center">
              <p className="text-sm font-semibold text-text-primary mb-1">No courses match your criteria</p>
              <p className="text-xs text-text-secondary mb-4">Try clearing filters or changing your search terms.</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
