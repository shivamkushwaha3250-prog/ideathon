import { memo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { Code, Database, Rocket, Briefcase, Award, CheckCircle2, Clock, Zap, TrendingUp, IndianRupee, X } from 'lucide-react'

const iconMap = {
  code: Code,
  database: Database,
  rocket: Rocket,
  briefcase: Briefcase,
  award: Award,
  'check-circle': CheckCircle2,
  clock: Clock,
  zap: Zap,
}

const statusConfig = {
  completed: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  'in-progress': {
    badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    glow: 'shadow-indigo-500/30',
    border: 'border-indigo-500/40',
    icon: Zap,
    iconColor: 'text-indigo-400',
    dot: 'bg-indigo-400',
  },
  upcoming: {
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    glow: 'shadow-purple-500/20',
    border: 'border-purple-500/30',
    icon: Clock,
    iconColor: 'text-purple-400',
    dot: 'bg-purple-400',
  },
}

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'Current Target',
  upcoming: 'Future Goal',
}

// Helper: YouTube search URL for a skill
const ytSearchUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' complete course for beginners')}`

// YouTube accent badge button
function YoutubeBadge({ label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 transition-colors duration-200"
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
      </svg>
      {label}
    </a>
  )
}

function CustomRoadmapNode({ data, selected }) {
  const [showDrawer, setShowDrawer] = useState(false)
  const config = statusConfig[data.status] || statusConfig.upcoming
  const IconComponent = iconMap[data.icon] || Code
  const StatusIcon = config.icon

  return (
    <>
      <div
        className={`
          relative w-72 rounded-2xl border backdrop-blur-xl p-5 cursor-pointer
          bg-white/[0.04] ${config.border}
          hover:shadow-lg ${config.glow} hover:scale-105
          transition-all duration-300 ease-out
          ${selected ? `ring-2 ring-indigo-400/50 shadow-xl ${config.glow}` : 'shadow-lg shadow-black/20'}
        `}
        onClick={() => setShowDrawer(true)}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-white/30 !border-2 !border-white/50"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-white/30 !border-2 !border-white/50"
        />

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${config.badge}`}>
            <StatusIcon className="w-3 h-3" />
            {statusLabels[data.status] || data.status}
          </span>
          <span className="text-[10px] font-medium text-zinc-500">#{data.stepNumber}</span>
        </div>

        {/* Icon Banner */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
            data.status === 'completed' ? 'from-emerald-500/20 to-emerald-600/10' :
            data.status === 'in-progress' ? 'from-indigo-500/20 to-indigo-600/10' :
            'from-purple-500/20 to-purple-600/10'
          } border ${
            data.status === 'completed' ? 'border-emerald-500/20' :
            data.status === 'in-progress' ? 'border-indigo-500/20' :
            'border-purple-500/20'
          } flex items-center justify-center`}>
            <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{data.title}</h3>
            <p className="text-xs text-zinc-400 truncate">{data.subtitle}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-2">
          {data.description}
        </p>

        {/* Salary Badge */}
        {data.expected_salary && (
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <IndianRupee className="w-3 h-3" />
              {data.expected_salary}
            </span>
          </div>
        )}

        {/* Future Scope Badge */}
        {data.future_scope && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <TrendingUp className="w-3 h-3" />
              {data.future_scope}
            </span>
          </div>
        )}

        {/* Skill Pills */}
        {data.skills && data.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/5 border border-white/10 text-zinc-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar for in-progress */}
        {data.status === 'in-progress' && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-zinc-500">Progress</span>
              <span className="text-[10px] font-bold text-indigo-400">{data.progress || 50}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${data.progress || 50}%` }}
              />
            </div>
          </div>
        )}

        {/* Glow effect on hover */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${
          data.status === 'completed' ? 'from-emerald-500/5' :
          data.status === 'in-progress' ? 'from-indigo-500/5' :
          'from-purple-500/5'
        } to-transparent`} />
      </div>

      {/* Side Drawer - Market Insights */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md h-full bg-surface-900 border-l border-white/10 shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-surface-900/95 backdrop-blur-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{data.title}</h2>
                <p className="text-sm text-zinc-400 mt-0.5">Market Insights</p>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${config.badge}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusLabels[data.status] || data.status}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">About this Role</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{data.description}</p>
              </div>

              {/* Salary Benchmark */}
              {data.expected_salary && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Expected Salary</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">{data.expected_salary}</p>
                  <p className="text-xs text-zinc-400 mt-1">Average annual compensation range</p>
                </div>
              )}

              {/* Future Scope */}
              {data.future_scope && (
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Future Scope</h3>
                  </div>
                  <p className="text-sm text-white font-medium">{data.future_scope}</p>
                  <p className="text-xs text-zinc-400 mt-1">5-year industry outlook & growth potential</p>
                </div>
              )}

              {/* Skills with YouTube Learn buttons */}
              {data.skills && data.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Key Skills</h3>
                  <div className="flex flex-col gap-2.5">
                    {data.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                      >
                        <span className="text-xs font-medium text-zinc-300">{skill}</span>
                        <YoutubeBadge
                          label="📺 Learn on YouTube"
                          href={ytSearchUrl(skill)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Learning Resource */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Free Learning Resource</h3>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  {data.learning_resource?.search_query || `Learn ${data.title} from scratch`}
                </p>
                <a
                  href={data.learning_resource?.url || ytSearchUrl(data.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-colors duration-200"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                  </svg>
                  ▶ Watch Free Course
                </a>
              </div>

              {/* Progress (if in-progress) */}
              {data.status === 'in-progress' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Current Progress</h3>
                    <span className="text-sm font-bold text-indigo-400">{data.progress || 50}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${data.progress || 50}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default memo(CustomRoadmapNode)
