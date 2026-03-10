interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`message ${role}`}>
      {role === 'assistant' && <div className="avatar">C</div>}
      <div className="bubble">{content}</div>
      <style>{`
        .message { display: flex; gap: 12px; align-items: flex-start; }
        .message.user { justify-content: flex-end; }
        .avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .message.user .bubble { background: rgba(246, 248, 255, 0.12); color: #f6f8ff; border-radius: 18px 18px 4px 18px; padding: 12px 16px; max-width: 70%; font-size: 15px; line-height: 1.5; }
        .message.assistant .bubble { color: rgba(246, 248, 255, 0.9); padding: 4px 0; max-width: 80%; font-size: 15px; line-height: 1.6; }
      `}</style>
    </div>
  )
}
