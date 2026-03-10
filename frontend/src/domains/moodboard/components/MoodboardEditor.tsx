import { useState, useRef } from 'react'
import type { Moodboard } from '../model/Moodboard'

interface MoodboardEditorProps {
  moodboard: Moodboard | null
  onUpload: (files: File[]) => void
}

export default function MoodboardEditor({ moodboard, onUpload }: MoodboardEditorProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer?.files || [])
    if (files.length > 0) onUpload(files)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) onUpload(files)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Moodboard
        {moodboard && <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-primary-light text-primary rounded-full text-xs font-semibold">{moodboard.imageUrls.length}</span>}
      </h3>

      <div
        className={`border-2 border-dashed rounded-[var(--radius-md)] py-8 px-5 text-center cursor-pointer transition-all duration-200 ${
          isDragging ? 'border-primary bg-primary-light' : 'border-border bg-bg hover:border-primary-subtle hover:bg-primary-light'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted mb-2 mx-auto">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
        <p className="text-sm text-text-secondary font-medium">Add reference images for style and mood</p>
        <p className="text-xs text-text-muted mt-1">Drop multiple images or click to browse</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      </div>

      {moodboard && moodboard.imageUrls.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
          {moodboard.imageUrls.map((url, idx) => (
            <div key={idx} className="aspect-square rounded-[var(--radius-sm)] overflow-hidden bg-border-light border border-border-light transition-all duration-200 hover:border-primary-subtle hover:shadow-sm">
              <img src={url} alt="moodboard reference" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {moodboard?.characteristics && (
        <div className="py-3 px-3.5 bg-bg rounded-[var(--radius-md)] border border-border-light">
          <span className="block text-[0.6875rem] uppercase tracking-wide text-text-muted font-semibold mb-1.5">Style Notes</span>
          <p className="text-[0.8125rem] text-text-secondary leading-relaxed">{moodboard.characteristics}</p>
        </div>
      )}

      {moodboard?.combinedUrl && (
        <div className="py-3 px-3.5 bg-bg rounded-[var(--radius-md)] border border-border-light">
          <span className="block text-[0.6875rem] uppercase tracking-wide text-text-muted font-semibold mb-1.5">Combined Moodboard</span>
          <div className="rounded-[var(--radius-sm)] overflow-hidden mt-2">
            <img src={moodboard.combinedUrl} alt="combined moodboard" className="w-full rounded-[var(--radius-sm)]" />
          </div>
        </div>
      )}
    </div>
  )
}
