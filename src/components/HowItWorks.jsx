import { FileText, Search, Compass, Map, PlayCircle, Trophy, TrendingUp, Sparkles } from 'lucide-react'

// This lucide-react version has no Youtube export — inline glyph instead
const YoutubeGlyph = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
)

const steps = [
  {
    num: '01',
    title: 'Upload Resume or Search Role',
    description:
      'Drop your PDF resume for instant AI analysis, or directly search any target tech role (e.g., Full Stack Developer).',
    Icon: FileText,
    SubIcon: Search,
    gradient: 'from-cyan-500 to-blue-600',
    numberGradient: 'from-cyan-400 to-sky-500',
    dotColor: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.85)',
  },
  {
    num: '02',
    title: 'AI Gap Analysis & Roadmap',
    description:
      'Gemini AI parses your skills, identifies missing tech gaps, and maps out a visual step-by-step career flowchart.',
    Icon: Compass,
    SubIcon: Map,
    gradient: 'from-indigo-500 to-violet-600',
    numberGradient: 'from-indigo-400 to-violet-500',
    dotColor: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.85)',
  },
  {
    num: '03',
    title: 'Learn with Free YouTube Tutorials',
    description:
      'Click on any missing skill node to access curated, high-quality free video resources and micro-projects.',
    Icon: PlayCircle,
    SubIcon: YoutubeGlyph,
    gradient: 'from-rose-500 to-red-600',
    numberGradient: 'from-rose-400 to-red-500',
    dotColor: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.85)',
  },
  {
    num: '04',
    title: 'Match with Hackathons & Track Growth',
    description:
      'Apply for student hackathons (like SIH), view expected salary ranges (LPA), and track market demand.',
    Icon: Trophy,
    SubIcon: TrendingUp,
    gradient: 'from-purple-500 to-fuchsia-600',
    numberGradient: 'from-purple-400 to-fuchsia-500',
    dotColor: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.85)',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 lg:px-8 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            How PathPilot <span className="text-gradient">Navigates Your Career</span>
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base lg:text-lg">
            From uploading your resume to landing hackathons &amp; dream tech roles in 4 actionable steps.
          </p>
        </div>

        {/* Desktop connector: glowing dashed progress line with step nodes */}
        <div className="hidden xl:grid grid-cols-4 gap-6 mb-5" aria-hidden="true">
          {steps.map((step, i) => {
            const pos =
              i === 0
                ? 'left-1/2 -right-3'
                : i === steps.length - 1
                ? 'right-1/2 -left-3'
                : '-left-3 -right-3'
            return (
              <div key={step.num} className="relative h-4">
                {/* Soft glow under the dash */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-px bg-indigo-400/70 blur-[3px] ${pos}`}
                />
                {/* Dashed line */}
                <div className={`absolute top-1/2 border-t border-dashed border-indigo-300/60 ${pos}`} />
                {/* Node dot */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-white/40 z-10"
                  style={{ backgroundColor: step.dotColor, boxShadow: `0 0 12px ${step.glow}` }}
                />
              </div>
            )
          })}
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative bg-white/5 border border-white/10 hover:border-indigo-500/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 overflow-hidden cursor-default"
            >
              {/* Gradient step number (top-right) */}
              <span
                className={`absolute top-4 right-4 text-sm font-extrabold tracking-widest bg-gradient-to-r ${step.numberGradient} bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
              >
                {step.num}
              </span>

              {/* Icon with secondary badge */}
              <div
                className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} mb-5 shadow-lg shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-110`}
              >
                <step.Icon className="w-6 h-6 text-white" strokeWidth={1.75} />
                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-md bg-[#0A0D14] border border-white/15 flex items-center justify-center text-white">
                  <step.SubIcon className="w-3 h-3" />
                </span>
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-white mb-2 pr-8 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>

              {/* Hover glow */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 pointer-events-none`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
