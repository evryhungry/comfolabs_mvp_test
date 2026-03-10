import { useState } from 'react'
import type { Rendering } from '../model/Rendering'
import { RenderingStatus } from '../model/Rendering'

interface RenderingResultProps {
  rendering: Rendering
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RenderingResult({ rendering }: RenderingResultProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  async function downloadImage() {
    if (!rendering.resultUrl) return
    try {
      const response = await fetch(rendering.resultUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rendering-${rendering.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(rendering.resultUrl, '_blank')
    }
  }

  function openInNewTab() {
    if (!rendering.resultUrl) return
    window.open(rendering.resultUrl, '_blank')
  }

  const statusColor = {
    [RenderingStatus.PENDING]: 'text-text-muted',
    [RenderingStatus.PROCESSING]: 'text-warning',
    [RenderingStatus.COMPLETED]: 'text-success',
    [RenderingStatus.FAILED]: 'text-danger',
  }[rendering.status]

  const dotColor = {
    [RenderingStatus.PENDING]: 'bg-text-muted',
    [RenderingStatus.PROCESSING]: 'bg-warning animate-pulse-dot',
    [RenderingStatus.COMPLETED]: 'bg-success',
    [RenderingStatus.FAILED]: 'bg-danger',
  }[rendering.status]

  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden transition-all duration-200 hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 border-b border-border-light">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${statusColor}`}>
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          {rendering.status}
        </span>
        <span className="text-[0.6875rem] text-text-muted">{formatDate(rendering.createdAt)}</span>
      </div>

      {/* Pending */}
      {rendering.status === RenderingStatus.PENDING && (
        <div className="flex flex-col items-center gap-3 py-6 px-4 text-text-muted text-center">
          <div className="opacity-50">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <p>Waiting to start...</p>
        </div>
      )}

      {/* Processing */}
      {rendering.status === RenderingStatus.PROCESSING && (
        <div className="flex flex-col items-center gap-4 py-6 px-4 text-warning text-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-14 h-14 border-2 border-warning rounded-full animate-pulse-ring" />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
          </div>
          <p>Generating your rendering...</p>
        </div>
      )}

      {/* Completed */}
      {rendering.status === RenderingStatus.COMPLETED && (
        <div className="p-0">
          {rendering.resultUrl ? (
            <div className="relative border-b border-border-light cursor-pointer group" onClick={() => setLightboxOpen(true)}>
              <img src={rendering.resultUrl} alt="rendering result" className="w-full block" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 text-white group-hover:opacity-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            </div>
          ) : (
            <div className="py-8 px-4 text-center text-text-muted text-sm">
              <p>Completed but no image URL returned</p>
            </div>
          )}
          <div className="py-3 px-4 flex items-center gap-1.5">
            <span className="inline-block py-0.5 px-2.5 bg-primary-light text-primary rounded-full text-[0.6875rem] font-semibold uppercase tracking-wide">{rendering.viewType}</span>
            {rendering.resultUrl && (
              <div className="flex gap-1 ml-auto">
                <button className="inline-flex items-center gap-1 py-1 px-2.5 border border-border rounded-[var(--radius-sm)] bg-surface text-[0.6875rem] font-medium text-text-secondary cursor-pointer transition-all duration-150 hover:bg-primary hover:text-white hover:border-primary" title="Download image" onClick={downloadImage}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download
                </button>
                <button className="inline-flex items-center gap-1 py-1 px-2.5 border border-border rounded-[var(--radius-sm)] bg-surface text-[0.6875rem] font-medium text-text-secondary cursor-pointer transition-all duration-150 hover:bg-primary hover:text-white hover:border-primary" title="Open in new tab" onClick={openInNewTab}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  New Tab
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Failed */}
      {rendering.status === RenderingStatus.FAILED && (
        <div className="flex flex-col items-center gap-3 py-6 px-4 text-center">
          <div className="text-danger">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <p className="text-[0.8125rem] text-danger max-w-[280px]">{rendering.errorMessage || 'Rendering failed unexpectedly'}</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && rendering.resultUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-[4px] p-6" onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false) }}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4">
            <img src={rendering.resultUrl} alt="rendering result full" className="max-w-full max-h-[calc(90vh-60px)] object-contain rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.5)]" />
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-1.5 py-2 px-4 border border-white/20 rounded-lg bg-white/10 text-white text-[0.8125rem] font-medium cursor-pointer transition-all duration-150 hover:bg-white/20 hover:border-white/40" onClick={downloadImage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
              <button className="inline-flex items-center gap-1.5 py-2 px-4 border border-white/20 rounded-lg bg-white/10 text-white text-[0.8125rem] font-medium cursor-pointer transition-all duration-150 hover:bg-white/20 hover:border-white/40" onClick={openInNewTab}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                New Tab
              </button>
              <button className="inline-flex items-center gap-1.5 py-2 px-4 border border-white/20 rounded-lg bg-white/10 text-white text-[0.8125rem] font-medium cursor-pointer transition-all duration-150 hover:bg-danger/60 hover:border-danger/80" onClick={() => setLightboxOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
