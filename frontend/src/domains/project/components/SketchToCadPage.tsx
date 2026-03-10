export default function SketchToCadPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <svg className="mx-auto mb-4 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f6f8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <p className="text-[#f6f8ff]/40 text-lg font-medium">Sketch to CAD</p>
        <p className="text-[#f6f8ff]/25 text-sm mt-1">Coming soon</p>
      </div>
    </div>
  )
}
