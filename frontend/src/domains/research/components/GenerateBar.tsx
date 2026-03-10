interface GenerateBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export default function GenerateBar({ value, onChange, onSend, onKeyDown }: GenerateBarProps) {
  return (
    <div className="input-area">
      <div className="generate-bar">
        <button className="send-btn" disabled={!value.trim()} onClick={onSend}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <textarea
          className="generate-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="메시지를 입력하세요..."
          rows={1}
          onKeyDown={onKeyDown}
        />
      </div>
      <style>{`
        .input-area { padding: 16px 18px 28px; }
        .generate-bar {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          height: 49px;
          background: rgba(246, 248, 255, 0.2);
          border-radius: 9px;
          padding: 0 10px;
          box-sizing: border-box;
        }
        .generate-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #f6f8ff;
          font-size: 14px;
          font-family: inherit;
          line-height: 1.4;
          resize: none;
          padding: 0 8px;
          max-height: 49px;
        }
        .generate-input::placeholder { color: rgba(246, 248, 255, 0.3); }
        .generate-bar .send-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  )
}
