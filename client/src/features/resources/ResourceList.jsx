import { useMemo, useState } from 'react';
import { useGetResourcesQuery } from '../../services/api';

function favicon(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?sz=64&domain=${u.hostname}`;
  } catch { return ''; }
}

export default function ResourceList() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [language, setLanguage] = useState('');

  const { data: items = [], isLoading } = useGetResourcesQuery({ q, category, tag, language, limit: 100 });

  const categories = useMemo(() => Array.from(new Set(items.map((x) => x.category).filter(Boolean))).sort(), [items]);
  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((x) => x.tags || []))).sort(),
    [items]
  );
  const languages = useMemo(() => Array.from(new Set(items.map((x) => x.language).filter(Boolean))).sort(), [items]);

  const clearFilters = () => {
    setQ('');
    setCategory('');
    setTag('');
    setLanguage('');
  };

  const hasActiveFilters = q || category || tag || language;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">Learning Resources</h1>
        <p className="text-gray-600">
          Discover curated financial education materials, articles, and tools
        </p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Filter Resources</h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Resources
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">🔍</span>
              <input
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Search titles, descriptions, sources..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={tag} 
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {tags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {q && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{q}"
                <button onClick={() => setQ('')} className="ml-1 hover:text-blue-900">×</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Category: {category}
                <button onClick={() => setCategory('')} className="ml-1 hover:text-green-900">×</button>
              </span>
            )}
            {tag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Tag: {tag}
                <button onClick={() => setTag('')} className="ml-1 hover:text-purple-900">×</button>
              </span>
            )}
            {language && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Language: {language.toUpperCase()}
                <button onClick={() => setLanguage('')} className="ml-1 hover:text-orange-900">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Resources {items.length > 0 && `(${items.length})`}
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "No resources available at the moment. Check back later!"
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((resource) => (
              <div key={resource.url} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block group"
                >
                  <div className="flex items-start space-x-4">
                    {resource.url && (
                      <div className="flex-shrink-0">
                        <img 
                          src={favicon(resource.url)} 
                          alt="" 
                          className="w-8 h-8 rounded border border-gray-200" 
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {resource.title}
                        </h3>
                        {resource.pinned && (
                          <span className="flex-shrink-0 ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center">
                            <span className="mr-1">📌</span>
                            Pinned
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                        {resource.source && (
                          <span className="font-medium">{resource.source}</span>
                        )}
                        {resource.readTime && (
                          <span>• {resource.readTime} min read</span>
                        )}
                        {resource.language && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {resource.language.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {resource.summary && (
                        <p className="text-gray-700 mt-3 line-clamp-2">
                          {resource.summary}
                        </p>
                      )}

                      {resource.tags && resource.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
                      ↗
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About These Resources</h3>
            <p className="text-gray-600">
              This collection features carefully curated financial education materials from trusted sources. 
              Use the filters above to find content that matches your interests and learning preferences. 
              Pinned resources are especially recommended for beginners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}