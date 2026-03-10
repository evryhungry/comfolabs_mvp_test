import { useState } from 'react'
import type { PromptTemplate } from '../model/Prompt'
import BaseButton from '../../../components/BaseButton'

interface PromptEditorProps {
  templates: PromptTemplate[]
  onSubmit: (payload: { templateId?: string; userInput: string }) => void
}

export default function PromptEditor({ templates, onSubmit }: PromptEditorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [userInput, setUserInput] = useState('')

  function handleSubmit() {
    onSubmit({
      templateId: selectedTemplateId || undefined,
      userInput,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        Prompt
      </h3>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.8125rem] font-semibold text-text-secondary">Prompt Template</label>
        <div className="relative">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full py-2.5 pr-9 pl-3.5 border border-border rounded-[var(--radius-md)] text-sm text-text bg-surface appearance-none outline-none cursor-pointer transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]"
          >
            <option value="">Default (no template)</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (v{t.version})
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[0.8125rem] font-semibold text-text-secondary">Design Requirements</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full py-3 px-3.5 border border-border rounded-[var(--radius-md)] text-sm text-text bg-surface resize-y outline-none transition-all duration-200 leading-relaxed min-h-[100px] placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]"
          placeholder={"Describe your desired look, materials, finish, colors...\ne.g. Matte black finish with brushed aluminum accents"}
          rows={5}
        />
        <span className="text-[0.6875rem] text-text-muted text-right">{userInput.length} characters</span>
      </div>

      <BaseButton label="Generate Rendering" size="lg" onClick={handleSubmit} />
    </div>
  )
}
