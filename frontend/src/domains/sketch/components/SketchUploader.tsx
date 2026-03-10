import { useState, useRef } from 'react'
import type { Sketch } from '../model/Sketch'

interface SketchUploaderProps {
  sketches: Sketch[]
  onUpload: (file: File) => void
  onRemove: (id: string) => void
}

export default function SketchUploader({ sketches, onUpload, onRemove }: SketchUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer?.files[0]
    if (file) onUpload(file)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        Sketches
        <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-primary-light text-primary rounded-full text-xs font-semibold">{sketches.length}</span>
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
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p className="text-sm text-text-secondary font-medium">Drop sketch files here or click to browse</p>
        <p className="text-xs text-text-muted mt-1">PNG, JPG up to 20MB</p>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
      </div>

      {sketches.length > 0 && (
        <div className="flex flex-col gap-2">
          {sketches.map((sketch) => (
            <div key={sketch.id} className="flex items-center gap-3 py-2.5 px-3 bg-bg border border-border-light rounded-[var(--radius-md)] transition-all duration-200 hover:border-border">
              <div className="w-12 h-12 rounded-[var(--radius-sm)] overflow-hidden shrink-0 bg-border-light">
                <img src={sketch.imageUrl} alt={sketch.filename} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-[0.8125rem] font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap">{sketch.filename}</span>
                <span className="text-[0.6875rem] text-text-muted">Order: {sketch.sortOrder}</span>
              </div>
              <button
                className="w-[30px] h-[30px] border-none bg-transparent text-text-muted rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 transition-all duration-200 hover:bg-danger-light hover:text-danger"
                title="Remove"
                onClick={() => onRemove(sketch.id)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
