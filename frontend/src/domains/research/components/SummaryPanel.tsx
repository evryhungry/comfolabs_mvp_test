interface SummaryPanelProps {
  summary: string
  isSummarizing: boolean
  onSummarize: () => void
}

export default function SummaryPanel({ summary, isSummarizing, onSummarize }: SummaryPanelProps) {
  return (
    <div className="summary-panel">
      {summary ? (
        <div className="summary-content">
          <p className="summary-text">{summary}</p>
        </div>
      ) : (
        <div className="summary-empty">
          <button className="summarize-btn" onClick={onSummarize} disabled={isSummarizing}>
            {isSummarizing ? '요약 중...' : '요약하기'}
          </button>
        </div>
      )}
      <style>{`
        .summary-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .summary-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summarize-btn {
          font-family: 'Urbanist', 'Noto Sans KR', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: black;
          background: #e9eef6;
          border: none;
          border-radius: 10px;
          padding: 18px 24px;
          cursor: pointer;
          transition: opacity 0.2s;
          letter-spacing: -0.078px;
          line-height: 1.31;
        }
        .summarize-btn:hover { opacity: 0.85; }
        .summarize-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .summary-content {
          padding: 24px 16px;
        }
        .summary-text {
          font-family: 'Pretendard', sans-serif;
          font-size: 14px;
          color: rgba(246, 248, 255, 0.8);
          line-height: 1.6;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  )
}
