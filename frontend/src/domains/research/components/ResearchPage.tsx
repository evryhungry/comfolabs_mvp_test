import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useProjectDetail } from '../../project/hooks/useProject'
import { useResearch } from '../hooks/useResearch'
import WelcomeView from './WelcomeView'
import ResearchHeader from './ResearchHeader'
import ChatPanel from './ChatPanel'
import SummaryPanel from './SummaryPanel'

export default function ResearchPage() {
  const { id: projectId } = useParams<{ id: string }>()
  const { currentProject } = useProjectDetail(projectId!)
  const { messages, summary, isSummarizing, sendMessage, summarize } = useResearch(projectId!)
  const [inputText, setInputText] = useState('')

  const isWelcome = messages.length === 0
  const projectName = currentProject?.title ?? 'Untitled'

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text) return
    setInputText('')
    sendMessage(projectId!, text)
  }, [inputText, projectId, sendMessage])

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleSummarize() {
    summarize(projectId!)
  }

  return (
    <div className="research-page">
      {isWelcome ? (
        <WelcomeView
          inputText={inputText}
          onInputChange={setInputText}
          onSend={handleSend}
          onKeyDown={handleKeydown}
        />
      ) : (
        <>
          <ResearchHeader projectName={projectName} />
          <div className="research-body">
            <ChatPanel
              messages={messages}
              inputText={inputText}
              onInputChange={setInputText}
              onSend={handleSend}
              onKeyDown={handleKeydown}
            />
            <div className="body-divider" />
            <SummaryPanel
              summary={summary}
              isSummarizing={isSummarizing}
              onSummarize={handleSummarize}
            />
          </div>
        </>
      )}
      <style>{`
        .research-page { display: flex; flex-direction: column; height: 100%; }
        .research-body { flex: 1; display: flex; overflow: hidden; }
        .body-divider { width: 1px; background: rgba(128, 128, 128, 0.2); flex-shrink: 0; }
        textarea { flex: 1; background: none; border: none; outline: none; color: #f6f8ff; font-size: 15px; font-family: inherit; line-height: 1.4; resize: none; padding: 0 8px; max-height: 56px; }
        textarea::placeholder { color: rgba(246, 248, 255, 0.3); }
        .send-btn { display: flex; align-items: center; justify-content: center; width: 33px; height: 33px; border-radius: 50%; border: none; background: #cecece; color: #151515; flex-shrink: 0; cursor: pointer; transition: opacity 0.2s; }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .send-btn:not(:disabled):hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}
