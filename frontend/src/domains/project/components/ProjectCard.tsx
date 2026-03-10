import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectDetail } from '../hooks/useProject'
import { useSketch } from '../../sketch/hooks/useSketch'
import { useMoodboard } from '../../moodboard/hooks/useMoodboard'
import { usePrompt } from '../../prompt/hooks/usePrompt'
import { useRendering } from '../../rendering/hooks/useRendering'
import SketchUploader from '../../sketch/components/SketchUploader'
import MoodboardEditor from '../../moodboard/components/MoodboardEditor'
import PromptEditor from '../../prompt/components/PromptEditor'
import RenderingResult from '../../rendering/components/RenderingResult'
import BaseButton from '../../../components/BaseButton'

export default function ProjectCard() {
  const { id: projectId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { currentProject, loading, error } = useProjectDetail(projectId!)
  const { sketches, uploadSketch, removeSketch } = useSketch(projectId!)
  const { moodboard, uploadMoodboard } = useMoodboard(projectId!)
  const { templates } = usePrompt(projectId!)
  const { renderings, executing, executeRendering } = useRendering(projectId!)

  const [activeTab, setActiveTab] = useState<'design' | 'render'>('design')
  const [selectedSketchId, setSelectedSketchId] = useState<string | null>(null)
  const [selectedMoodboardIndex, setSelectedMoodboardIndex] = useState<number | null>(null)

  async function handleSketchUpload(file: File) {
    try { await uploadSketch(projectId!, file) } catch { /* store */ }
  }

  async function handleSketchRemove(id: string) {
    if (selectedSketchId === id) setSelectedSketchId(null)
    try { await removeSketch(id) } catch { /* store */ }
  }

  async function handleMoodboardUpload(files: File[]) {
    try { await uploadMoodboard(projectId!, files) } catch { /* store */ }
  }

  function selectSketch(id: string) {
    setSelectedSketchId(selectedSketchId === id ? null : id)
  }

  function selectMoodboardImage(index: number) {
    setSelectedMoodboardIndex(selectedMoodboardIndex === index ? null : index)
  }

  async function handleExecuteRendering(payload: { templateId?: string; userInput: string }) {
    try {
      await executeRendering({
        projectId: projectId!,
        userPrompt: payload.userInput || undefined,
        sketchId: selectedSketchId ?? undefined,
        moodboardImageIndex: selectedMoodboardIndex ?? undefined,
        promptTemplateId: payload.templateId,
      })
    } catch { /* store */ }
  }

  return (
    <div className="max-w-[1120px] mx-auto">
      <button className="inline-flex items-center gap-1.5 bg-none border-none text-sm text-text-secondary mb-6 py-1 px-0 transition-colors duration-200 hover:text-primary group cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-lg transition-transform duration-200 group-hover:-translate-x-0.5">&larr;</span>
        Back to Projects
      </button>

      {loading && (
        <div className="flex justify-center py-[100px]">
          <div className="w-9 h-9 border-3 border-border border-t-primary rounded-full animate-spin-slow" />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20 text-danger flex flex-col items-center gap-4">
          <p>{error}</p>
          <BaseButton label="Go Back" variant="secondary" onClick={() => navigate('/')} />
        </div>
      )}

      {!loading && !error && currentProject && (
        <>
          {/* Project Header */}
          <div className="flex items-start justify-between gap-6 mb-7">
            <div>
              <h1 className="mb-1">{currentProject.title}</h1>
              {currentProject.description && <p className="text-text-secondary text-[0.9375rem]">{currentProject.description}</p>}
            </div>
            <div className="flex gap-5 shrink-0">
              {[
                { count: sketches.length, label: 'Sketches' },
                { count: moodboard ? moodboard.imageUrls.length : 0, label: 'Mood Refs' },
                { count: renderings.length, label: 'Renders' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-3 px-[18px] bg-surface border border-border rounded-[var(--radius-md)] min-w-[80px]">
                  <span className="block text-[1.375rem] font-bold text-primary leading-none">{stat.count}</span>
                  <span className="block text-[0.6875rem] text-text-muted mt-1 uppercase tracking-wide font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-surface border border-border rounded-[var(--radius-md)] p-1 mb-6">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border-none rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200 ${
                activeTab === 'design' ? 'bg-primary text-white shadow-[0_2px_8px_rgba(99,102,241,0.25)]' : 'bg-transparent text-text-secondary hover:text-text hover:bg-bg'
              }`}
              onClick={() => setActiveTab('design')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
              </svg>
              Design Assets
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border-none rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200 ${
                activeTab === 'render' ? 'bg-primary text-white shadow-[0_2px_8px_rgba(99,102,241,0.25)]' : 'bg-transparent text-text-secondary hover:text-text hover:bg-bg'
              }`}
              onClick={() => setActiveTab('render')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v18m-7-4l7 4 7-4M5 8l7-5 7 5"/>
              </svg>
              Rendering
            </button>
          </div>

          {/* Design Tab */}
          <div style={{ display: activeTab === 'design' ? 'block' : 'none' }}>
            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <section className="bg-surface border border-border rounded-[var(--radius-lg)] p-6">
                <SketchUploader sketches={sketches} onUpload={handleSketchUpload} onRemove={handleSketchRemove} />
              </section>
              <section className="bg-surface border border-border rounded-[var(--radius-lg)] p-6">
                <MoodboardEditor moodboard={moodboard} onUpload={handleMoodboardUpload} />
              </section>
            </div>
          </div>

          {/* Rendering Tab */}
          <div style={{ display: activeTab === 'render' ? 'block' : 'none' }}>
            <div className="grid grid-cols-[380px_1fr] gap-5 items-start max-[900px]:grid-cols-1">
              <section className="bg-surface border border-border rounded-[var(--radius-lg)] p-6 sticky top-[92px]">
                {/* Sketch Selection */}
                {sketches.length > 0 ? (
                  <div className="mb-5 pb-5 border-b border-border-light">
                    <h4 className="text-[0.8125rem] font-semibold text-text mb-2.5">Select Sketch</h4>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
                      {sketches.map((sketch) => (
                        <button
                          key={sketch.id}
                          className={`relative w-full aspect-square border-2 rounded-[var(--radius-sm)] overflow-hidden cursor-pointer p-0 bg-bg transition-all duration-200 ${
                            selectedSketchId === sketch.id ? 'border-primary shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' : 'border-border hover:border-primary-subtle'
                          }`}
                          onClick={() => selectSketch(sketch.id)}
                        >
                          <img src={sketch.imageUrl} alt={sketch.filename} className="w-full h-full object-cover" />
                          {selectedSketchId === sketch.id && (
                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {!selectedSketchId ? (
                      <p className="text-[0.6875rem] text-text-muted mt-2">No sketch selected (first sketch will be used)</p>
                    ) : (
                      <p className="text-[0.6875rem] text-primary font-medium mt-2">
                        {sketches.find((s) => s.id === selectedSketchId)?.filename}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-5 p-4 bg-bg rounded-[var(--radius-md)] text-center text-[0.8125rem] text-text-muted">
                    <p>No sketches uploaded. Go to Design Assets tab to upload sketches.</p>
                  </div>
                )}

                {/* Moodboard Selection */}
                {moodboard && moodboard.imageUrls.length > 0 ? (
                  <div className="mb-5 pb-5 border-b border-border-light">
                    <h4 className="text-[0.8125rem] font-semibold text-text mb-2.5">Select Mood Reference</h4>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
                      {moodboard.imageUrls.map((url, idx) => (
                        <button
                          key={idx}
                          className={`relative w-full aspect-square border-2 rounded-[var(--radius-sm)] overflow-hidden cursor-pointer p-0 bg-bg transition-all duration-200 ${
                            selectedMoodboardIndex === idx ? 'border-primary shadow-[0_0_0_2px_rgba(99,102,241,0.2)]' : 'border-border hover:border-primary-subtle'
                          }`}
                          onClick={() => selectMoodboardImage(idx)}
                        >
                          <img src={url} alt="moodboard reference" className="w-full h-full object-cover" />
                          {selectedMoodboardIndex === idx && (
                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedMoodboardIndex === null ? (
                      <p className="text-[0.6875rem] text-text-muted mt-2">No image selected (first image will be used)</p>
                    ) : (
                      <p className="text-[0.6875rem] text-primary font-medium mt-2">Mood reference #{selectedMoodboardIndex + 1}</p>
                    )}
                  </div>
                ) : (
                  <div className="mb-5 p-4 bg-bg rounded-[var(--radius-md)] text-center text-[0.8125rem] text-text-muted">
                    <p>No moodboard uploaded. Go to Design Assets tab to upload references.</p>
                  </div>
                )}

                <PromptEditor templates={templates} onSubmit={handleExecuteRendering} />
                {executing && (
                  <div className="flex items-center gap-2.5 py-3 px-4 mt-4 bg-primary-light rounded-[var(--radius-md)] text-[0.8125rem] text-primary font-medium">
                    <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin-slow" />
                    <span>Generating rendering...</span>
                  </div>
                )}
              </section>
              <section className="bg-surface border border-border rounded-[var(--radius-lg)] p-6">
                <h3 className="flex items-center gap-2 mb-4 text-text">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                  </svg>
                  Results
                </h3>
                {renderings.length === 0 ? (
                  <div className="text-center py-12 px-6 text-text-muted text-sm">
                    <p>No renderings yet. Configure your prompt and click "Generate" to start.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {renderings.map((r) => <RenderingResult key={r.id} rendering={r} />)}
                  </div>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
