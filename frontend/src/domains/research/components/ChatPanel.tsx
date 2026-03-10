import { useRef } from 'react'
import type { Message } from '../model/Research'
import ChatMessage from './ChatMessage'
import GenerateBar from './GenerateBar'

interface ChatPanelProps {
  messages: Message[]
  inputText: string
  onInputChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export default function ChatPanel({ messages, inputText, onInputChange, onSend, onKeyDown }: ChatPanelProps) {
  const messagesEl = useRef<HTMLDivElement>(null)

  return (
    <div className="chat-panel">
      <div ref={messagesEl} className="messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
      </div>
      <GenerateBar
        value={inputText}
        onChange={onInputChange}
        onSend={onSend}
        onKeyDown={onKeyDown}
      />
      <style>{`
        .chat-panel {
          flex: 0 0 548px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  )
}
