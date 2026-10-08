import { useState } from 'react'
import { Search, Sparkles, Loader2 } from 'lucide-react'

const TRENDING_ROLES = ['Web Developer', 'Data Scientist', 'Android Dev', 'Cloud Engineer']

export default function RoleSearchBar({ onRoadmapGenerated }) {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingRole, setLoadingRole] = useState('')

  const generateRoadmap = async (targetRole) => {
    const cleanRole = (targetRole || '').trim()
    if (!cleanRole || loading) return

    setLoading(true)
    setError(null)
    setLoadingRole(cleanRole)

    try {
      const response = await fetch('http://localhost:5000/api/generate-role-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_role: cleanRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap')
      }

      onRoadmapGenerated(data, cleanRole)
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap. Make sure the backend server is running.')
    } finally {
      setLoading(false)
      setLoadingRole('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    generateRoadmap(role)
  }

  const handlePillClick = (pillRole) => {
    setRole(pillRole)
    generateRoadmap(pillRole)
  }

  return (
    <section className="relative px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wide text-cyan-300 uppercase">
              Direct Role Search
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Know your goal? <span className="text-gradient">Get an instant roadmap.</span>
          </h2>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="relative mb-4">
          <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md focus-within:border-indigo-500/40 transition-all duration-300">
            <div className="flex items-center flex-1 gap-3 px-3">
              <Search className="w-5 h-5 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Type any career goal (e.g. Full Stack Web Developer, AI Engineer, DevOps)..."
                className="w-full bg-transparent py-3 text-sm text-white placeholder-zinc-500 outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !role.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Roadmap 🚀
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Message */}
        {loading && (
          <div className="flex items-center justify-center gap-2 mb-4 py-3 px-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <p className="text-sm text-indigo-300 font-medium">
              Building roadmap for <span className="text-white font-semibold">{loadingRole}</span>...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Trending Role Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-zinc-500 font-medium mr-1">Trending:</span>
          {TRENDING_ROLES.map((trendingRole) => (
            <button
              key={trendingRole}
              onClick={() => handlePillClick(trendingRole)}
              disabled={loading}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {trendingRole}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
