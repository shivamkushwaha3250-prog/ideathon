const features = [
  {
    title: 'AI Resume & Skill Gap Parser',
    description: 'Instant text extraction & gap identification from your resume. Our AI analyzes every line to map your current skills against target roles.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Interactive Flowchart Roadmaps',
    description: 'Node-based visual pathways that adapt to your pace. Click any milestone to see exactly what to learn, in what order, and why.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    title: 'Micro-Project Generator',
    description: 'Practical project recommendations tailored to fill your specific skill gaps. Build portfolio-ready projects that prove your abilities.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    gradient: 'from-purple-500 to-fuchsia-600',
  },
  {
    title: 'Student & Hackathon Matcher',
    description: 'Tailored opportunities for college students. Find hackathons, internships, and competitions that match your growing skill set.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-600',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative px-6 lg:px-8 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Everything You Need to
            <span className="text-gradient"> Launch Your Career</span>
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base lg:text-lg">
            From resume analysis to project building — PathPilot gives you the complete toolkit to go from student to software engineer.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 lg:p-8 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 card-glow hover:card-glow-hover"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg lg:text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm lg:text-base text-zinc-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
