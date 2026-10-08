import { useState } from 'react'
import { Trophy, MapPin, Users, Sparkles, ExternalLink, X } from 'lucide-react'

const FALLBACK_URL = 'https://unstop.com/hackathons'
const regUrl = (h) => h?.registration_url || FALLBACK_URL

const locationConfig = {
  Online: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: '🌐' },
  Hybrid: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🔄' },
  Local: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: '📍' },
}

function RegisterButton({ href, className = '', label = 'Register Now' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/40 text-white font-medium rounded-lg px-4 py-2 transition-all ${className}`}
    >
      <ExternalLink className="w-4 h-4" />
      {label}
    </a>
  )
}

function HackathonCard({ hackathon }) {
  const [showDetails, setShowDetails] = useState(false)
  const locConfig = locationConfig[hackathon.location_type] || locationConfig.Online

  return (
    <>
      <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 card-glow hover:card-glow-hover">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{hackathon.title}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500">{hackathon.location_type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          {hackathon.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Eligibility */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <Users className="w-3 h-3" />
            {hackathon.eligibility}
          </span>

          {/* Location */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full border ${locConfig.color}`}>
            <MapPin className="w-3 h-3" />
            {hackathon.location_type}
          </span>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Skills Needed</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hackathon.relevant_skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-300 hover:from-amber-500/20 hover:to-orange-500/20 hover:border-amber-500/30 transition-all duration-300"
          >
            <Sparkles className="w-3.5 h-3.5" />
            View Details
          </button>
          <RegisterButton
            href={regUrl(hackathon)}
            label="Register"
            className="flex-1 !text-xs !px-3"
          />
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-surface-900 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{hackathon.title}</h2>
                  <p className="text-sm text-zinc-400">{hackathon.location_type}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">About</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{hackathon.description}</p>
              </div>

              {/* Eligibility */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Eligibility</h3>
                </div>
                <p className="text-sm text-white font-medium">{hackathon.eligibility}</p>
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Skills Needed</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hackathon.relevant_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Mode</h3>
                </div>
                <p className="text-sm text-white font-medium">{hackathon.location_type}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <RegisterButton
                href={regUrl(hackathon)}
                label="Register Now"
                className="w-full !px-6 !py-3 !text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function HackathonList({ hackathons }) {
  if (!hackathons || hackathons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hackathons recommended yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hackathons.map((hackathon, index) => (
        <HackathonCard key={index} hackathon={hackathon} />
      ))}
    </div>
  )
}
