import iconPlus from '../../../assets/icons/icon-plus.svg?raw'
import iconArrowRight from '../../../assets/icons/icon-arrow-right.svg?raw'

interface WelcomeViewProps {
  inputText: string
  onInputChange: (value: string) => void
  onSend: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export default function WelcomeView({ inputText, onInputChange, onSend, onKeyDown }: WelcomeViewProps) {
  return (
    <div className="welcome">
      <div className="welcome-inner">
        <p className="welcome-text">무엇을 연구하시겠습니까?</p>
        <div className="welcome-input">
          <div className="input-bar">
            <button className="add-btn" title="Add files">
              <span className="icon-wrap" dangerouslySetInnerHTML={{ __html: iconPlus }} />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="메시지를 입력하세요..."
              rows={1}
              onKeyDown={onKeyDown}
            />
            <button className="send-btn" disabled={!inputText.trim()} onClick={onSend}>
              <span className="icon-wrap" dangerouslySetInnerHTML={{ __html: iconArrowRight }} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .welcome { flex: 1; display: flex; align-items: center; justify-content: center; }
        .welcome-inner { display: flex; flex-direction: column; align-items: center; gap: 51px; width: 100%; padding: 0 24px; }
        .welcome-input { width: 100%; display: flex; justify-content: center; }
        .welcome-text { font-size: 23px; font-weight: 600; color: #f6f8ff; line-height: 1.4; }
        .icon-wrap { display: flex; align-items: center; justify-content: center; }
        .icon-wrap svg { width: 20px; height: 20px; }
        .send-btn .icon-wrap svg { width: 14px; height: 14px; }
        .input-bar { display: flex; align-items: center; width: min(100%, 768px); height: 56px; border: 1px solid rgba(128, 128, 128, 0.55); border-radius: 55px; background: #151515; padding: 0 10px; gap: 4px; box-sizing: border-box; }
        .add-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: none; background: none; color: rgba(246, 248, 255, 0.5); border-radius: 50%; flex-shrink: 0; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .add-btn:hover { background: rgba(246, 248, 255, 0.08); color: #f6f8ff; }
      `}</style>
    </div>
  )
}
