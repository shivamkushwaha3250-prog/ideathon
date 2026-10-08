const pathNodes = [
  { label: 'C Programmer', status: 'completed', color: 'from-emerald-400 to-emerald-600' },
  { label: 'Data Structures', status: 'completed', color: 'from-cyan-400 to-cyan-600' },
  { label: 'Full Stack Dev', status: 'current', color: 'from-indigo-400 to-indigo-600' },
  { label: 'SDE Intern', status: 'upcoming', color: 'from-purple-400 to-purple-600' },
]

export default function HeroVisual() {
  return (
    <section className="relative px-6 lg:px-8 pb-20 lg:pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Dashboard Card */}
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 lg:p-10 card-glow hover:card-glow-hover transition-all duration-500">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400">Live Preview</span>
            </div>
          </div>

          {/* Career Path Visualization */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/40 via-indigo-500/40 to-purple-500/40 -translate-y-1/2 hidden sm:block" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-4">
              {pathNodes.map((node, i) => (
                <div key={node.label} className="relative flex flex-col items-center text-center group">
                  {/* Node dot */}
                  <div className="relative mb-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${node.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      node.status === 'current' ? 'ring-2 ring-indigo-400/50 ring-offset-4 ring-offset-surface-900' : ''
                    }`}>
                      {node.status === 'completed' && (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {node.status === 'current' && (
                        <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {node.status === 'upcoming' && (
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${node.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
                  </div>

                  {/* Label */}
                  <span className={`text-sm font-semibold mb-1 ${
                    node.status === 'current' ? 'text-white' : 'text-zinc-300'
                  }`}>
                    {node.label}
                  </span>
                  <span className={`text-xs font-medium capitalize ${
                    node.status === 'completed' ? 'text-emerald-400' :
                    node.status === 'current' ? 'text-indigo-400' :
                    'text-zinc-500'
                  }`}>
                    {node.status === 'current' ? 'In Progress' : node.status}
                  </span>

                  {/* Step number */}
                  <span className="mt-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    Step {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">4</div>
              <div className="text-xs text-zinc-500 mt-1">Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gradient">68%</div>
              <div className="text-xs text-zinc-500 mt-1">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">12</div>
              <div className="text-xs text-zinc-500 mt-1">Skills Gained</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
