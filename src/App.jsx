import { useState, useRef } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import HeroVisual from './components/HeroVisual.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import UploadCTA from './components/UploadCTA.jsx'
import RoleSearchBar from './components/RoleSearchBar.jsx'
import RoadmapView from './components/RoadmapView.jsx'
import CareerMaps from './components/CareerMaps.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [roleResult, setRoleResult] = useState(null)
  const [activeRole, setActiveRole] = useState('')
  const roadmapRef = useRef(null)

  const handleRoadmapGenerated = (data, role) => {
    setRoleResult(data)
    setActiveRole(role)
    // Scroll to roadmap view after render
    setTimeout(() => {
      roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const handleCloseRoadmap = () => {
    setRoleResult(null)
    setActiveRole('')
  }

  return (
    <div className="min-h-screen bg-surface-900 text-white overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/4 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <HeroVisual />

          {/* Direct Role Search */}
          <RoleSearchBar onRoadmapGenerated={handleRoadmapGenerated} />

          {/* Role Roadmap Result */}
          {roleResult && (
            <section ref={roadmapRef} className="px-6 lg:px-8 py-12">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Career Roadmap: <span className="text-gradient">{activeRole}</span>
                      </h3>
                      <p className="text-sm text-zinc-400 mt-1">{roleResult.user_summary}</p>
                    </div>
                    <button
                      onClick={handleCloseRoadmap}
                      className="px-4 py-2 text-xs font-medium rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all shrink-0"
                    >
                      Close
                    </button>
                  </div>
                  <RoadmapView
                    roadmapNodes={roleResult.roadmap_nodes}
                    hackathons={roleResult.recommended_hackathons}
                  />
                </div>
              </div>
            </section>
          )}

          <Features />
          <HowItWorks />
          <CareerMaps />
          <UploadCTA />
        </main>
        <Footer />
      </div>
    </div>
  )
}
