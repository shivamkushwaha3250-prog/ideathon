import { useState, useMemo } from 'react'
import { Search, ArrowRight, Map } from 'lucide-react'
import { roadmapCatalog, categoryMeta } from '../data/roadmaps.js'
import RoadmapDetail from './RoadmapDetail.jsx'

export default function CareerMaps() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedRoadmap, setSelectedRoadmap] = useState(null)

  const filtered = useMemo(() => {
    return roadmapCatalog.filter((r) => {
      const matchesCategory = activeCategory === 'all' || r.category === activeCategory
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.steps.some((s) => s.title.toLowerCase().includes(q))
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  const counts = useMemo(() => ({
    all: roadmapCatalog.length,
    role: roadmapCatalog.filter((r) => r.category === 'role').length,
    skill: roadmapCatalog.filter((r) => r.category === 'skill').length,
  }), [])

  // ─── Detail View ───────────────────────────────────────────
  if (selectedRoadmap) {
    return (
      <section id="career-maps" className="px-6 lg:px-8 py-20 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <RoadmapDetail roadmap={selectedRoadmap} onBack={() => setSelectedRoadmap(null)} />
        </div>
      </section>
    )
  }

  // ─── Listing View ──────────────────────────────────────────
  return (
    <section id="career-maps" className="px-6 lg:px-8 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 mb-4">
            <Map className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-semibold tracking-wide text-purple-300 uppercase">
              Career Maps
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Developer <span className="text-gradient">Roadmaps</span>
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base lg:text-lg">
            Community-style step-by-step roadmaps to skill up and grow in your career.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roadmaps (e.g. Frontend, Python, Docker)..."
            className="w-full pl-12 pr-4 py-3.5 text-sm rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md text-white placeholder-zinc-500 outline-none focus:border-indigo-500/40 transition-all duration-300"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[
            { key: 'all', label: 'All Roadmaps' },
            { key: 'role', label: 'Role-based' },
            { key: 'skill', label: 'Skill-based' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                activeCategory === tab.key
                  ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeCategory === tab.key ? 'bg-white/10 text-white' : 'bg-white/5 text-zinc-500'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((roadmap) => (
              <button
                key={roadmap.id}
                onClick={() => setSelectedRoadmap(roadmap)}
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 card-glow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                      {roadmap.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {roadmap.title}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        {categoryMeta[roadmap.category].label}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">{roadmap.description}</p>
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                    {roadmap.steps.length} steps
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    Free
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
            <Search className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No roadmaps match "{query}"</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </section>
  )
}
