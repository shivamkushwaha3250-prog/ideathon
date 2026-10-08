import { useState, useRef } from 'react'
import RoadmapView from './RoadmapView.jsx'

export default function UploadCTA() {
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      fileRef.current = file
      setFileName(file.name)
      setAnalysisResult(null)
      setError(null)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      fileRef.current = file
      setFileName(file.name)
      setAnalysisResult(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    const file = fileRef.current || inputRef.current?.files[0]
    if (!file) return

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysisResult(data)
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Make sure the backend server is running.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setFileName(null)
    setError(null)
    fileRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <section id="upload" className="relative px-6 lg:px-8 py-20 lg:py-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Ready to <span className="text-gradient">Start Your Journey?</span>
          </h2>
          <p className="text-zinc-400 text-base lg:text-lg">
            Upload your resume and let PathPilot chart your path to your dream role.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isAnalyzing && inputRef.current?.click()}
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-10 sm:p-16 text-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-400/60 bg-indigo-500/5 scale-[1.01]'
              : analysisResult
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Analyzing your resume...</p>
                <p className="text-zinc-400 text-sm mt-1">AI is crafting your personalized career roadmap</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Analysis Complete!</p>
                <p className="text-zinc-400 text-sm mt-1">Scroll down to see your interactive roadmap</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleReset() }}
                className="mt-2 px-5 py-2 text-sm font-medium rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
              >
                Analyze Another Resume
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/10'
              }`}>
                <svg className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-indigo-400' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">
                  {isDragging ? 'Drop your resume here' : fileName ? fileName : 'Drag & drop your resume'}
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  {fileName ? 'Click "Analyze" below to generate your roadmap' : 'or click to browse — PDF files only'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Your file is processed securely and never stored
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        {fileName && !analysisResult && !isAnalyzing && (
          <div className="mt-6 text-center">
            <button
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze My Resume
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-12 space-y-8">
            {/* User Summary */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-2">Your Profile Summary</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{analysisResult.user_summary}</p>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Your Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.current_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Skills to Develop</h4>
                <div className="flex flex-col gap-2">
                  {analysisResult.missing_skills.map((item) => {
                    const skillName = typeof item === 'string' ? item : item.skill
                    const url =
                      (typeof item === 'object' && item.learning_resource?.url) ||
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' complete course for beginners')}`
                    return (
                      <div key={skillName} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-xs font-medium text-amber-300">{skillName}</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 transition-colors duration-200 shrink-0"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
                          </svg>
                          ▶ Watch Free Course
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Roadmap Flowchart */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-6">Your Career Roadmap</h3>
              <RoadmapView roadmapNodes={analysisResult.roadmap_nodes} hackathons={analysisResult.recommended_hackathons} />
            </div>

            {/* Micro Projects */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
              <h3 className="text-lg font-bold text-white mb-6">Recommended Micro-Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysisResult.recommended_micro_projects.map((project) => (
                  <div key={project.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold text-sm">{project.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        project.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-2">{project.description}</p>
                    <p className="text-indigo-400 text-xs font-medium">For: {project.for_skill}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
