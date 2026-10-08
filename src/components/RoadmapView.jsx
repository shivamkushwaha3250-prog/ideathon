import { useState, lazy, Suspense, useMemo, useCallback } from 'react'
import 'reactflow/dist/style.css'
import CustomRoadmapNode from './CustomRoadmapNode.jsx'
import HackathonList from './HackathonList.jsx'

const ReactFlow = lazy(() =>
  import('reactflow').then((mod) => ({ default: mod.default }))
)
const Background = lazy(() =>
  import('reactflow').then((mod) => ({ default: mod.Background }))
)
const BackgroundVariant = lazy(() =>
  import('reactflow').then((mod) => ({ default: mod.BackgroundVariant }))
)
const Controls = lazy(() =>
  import('reactflow').then((mod) => ({ default: mod.Controls }))
)
const MiniMap = lazy(() =>
  import('reactflow').then((mod) => ({ default: mod.MiniMap }))
)
const MarkerType = lazy(() =>
  import('reactflow').then((mod) => ({ default: mod.MarkerType }))
)

const nodeTypes = {
  custom: CustomRoadmapNode,
}

function buildFlowData(roadmapNodes) {
  const nodes = []
  const edges = []

  if (!roadmapNodes || roadmapNodes.length === 0) {
    return { nodes, edges }
  }

  const nodeWidth = 288
  const horizontalGap = 100
  const verticalGap = 80

  roadmapNodes.forEach((node, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = col * (nodeWidth + horizontalGap)
    const y = row * (200 + verticalGap)

    nodes.push({
      id: node.id || String(index + 1),
      type: 'custom',
      position: { x, y },
      data: {
        title: node.title,
        subtitle: node.description?.substring(0, 50) + '...' || '',
        description: node.description,
        status: node.status,
        icon: node.icon || 'code',
        stepNumber: index + 1,
        skills: node.skills || [],
        progress: node.progress || (node.status === 'in-progress' ? 50 : node.status === 'completed' ? 100 : 0),
        expected_salary: node.expected_salary || '',
        future_scope: node.future_scope || '',
        learning_resource: node.learning_resource || null,
      },
    })

    if (index > 0) {
      const prevId = roadmapNodes[index - 1]?.id || String(index)
      edges.push({
        id: `edge-${prevId}-${node.id || index + 1}`,
        source: prevId,
        target: node.id || String(index + 1),
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'url(#edge-gradient)', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6366f1',
          width: 20,
          height: 20,
        },
      })
    }
  })

  return { nodes, edges }
}

function RoadmapLoading() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-white/10 flex items-center justify-center bg-surface-900/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-zinc-400 text-sm">Loading roadmap...</p>
      </div>
    </div>
  )
}

export default function RoadmapView({ roadmapNodes, hackathons }) {
  const [activeTab, setActiveTab] = useState('roadmap')
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlowData(roadmapNodes),
    [roadmapNodes]
  )

  const onInit = useCallback((reactFlowInstance) => {
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2 })
    }, 100)
  }, [])

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-white/[0.03] border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'roadmap'
              ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <span>📊</span>
          Interactive Roadmap
        </button>
        <button
          onClick={() => setActiveTab('hackathons')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
            activeTab === 'hackathons'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-500/30 shadow-lg shadow-amber-500/10'
              : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <span>🏆</span>
          Hackathons & Events
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'roadmap' && (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 relative" style={{ background: '#0A0D14' }}>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>

          <Suspense fallback={<RoadmapLoading />}>
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              nodeTypes={nodeTypes}
              onInit={onInit}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1.5}
                color="rgba(255, 255, 255, 0.08)"
              />
              <Controls
                showInteractive={false}
                position="bottom-left"
              />
              <MiniMap
                position="bottom-right"
                nodeColor={(node) => {
                  const status = node.data?.status
                  if (status === 'completed') return '#10b981'
                  if (status === 'in-progress') return '#6366f1'
                  return '#9333ea'
                }}
                maskColor="rgba(10, 13, 20, 0.8)"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              />
            </ReactFlow>
          </Suspense>
        </div>
      )}

      {activeTab === 'hackathons' && (
        <HackathonList hackathons={hackathons} />
      )}
    </div>
  )
}
