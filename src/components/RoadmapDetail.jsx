import { useState } from 'react'
import { ArrowLeft, CheckCircle2, PlayCircle, ChevronDown } from 'lucide-react'

const ytUrl = (query) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' complete tutorial for beginners hindi')}`

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
)

function StepNode({ step, index, total, isLast }) {
  const [expanded, setExpanded] = useState(true)
  const isFirst = index === 0
  const isLastStep = index === total - 1

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        {/* Node dot */}
        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
          isFirst
            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
            : isLastStep
            ? 'bg-purple-500/15 border-purple-500/50 text-purple-400'
            : 'bg-indigo-500/15 border-indigo-500/50 text-indigo-400'
        }`}>
          {isFirst ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <span className="text-xs font-bold">{index + 1}</span>
          )}
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div className="w-px flex-1 min-h-[1.5rem] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
        )}
      </div>

      {/* Step Card */}
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-8'}`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{step.title}</h4>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 ${
                isFirst
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : isLastStep
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
              }`}>
                {isFirst ? 'Start' : isLastStep ? 'Goal' : `Step ${index + 1}`}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-zinc-500 group-hover:text-white transition-transform duration-300 shrink-0 ${expanded ? 'rotate-180' : ''}`} />
          </div>

          {/* Topics */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {step.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/5 border border-white/10 text-zinc-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <a
                href={ytUrl(step.title)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors duration-200"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
                Watch Free Course
              </a>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

export default function RoadmapDetail({ roadmap, onBack }) {
  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All Roadmaps
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl shrink-0">
          {roadmap.icon}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {roadmap.title}
          </h1>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">{roadmap.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 uppercase tracking-wider">
              {roadmap.steps.length} Steps
            </span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 uppercase tracking-wider">
              Beginner Friendly
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Step Flow */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 sm:p-8">
        {roadmap.steps.map((step, index) => (
          <StepNode
            key={index}
            step={step}
            index={index}
            total={roadmap.steps.length}
            isLast={index === roadmap.steps.length - 1}
          />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 p-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Want a personalized version?</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Upload your resume and let AI tailor this roadmap to your exact skill gaps.
        </p>
        <a
          href="#upload"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <PlayCircle className="w-4 h-4" />
          Upload Resume
        </a>
      </div>
    </div>
  )
}
