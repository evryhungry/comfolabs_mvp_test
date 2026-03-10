interface ResearchHeaderProps {
  projectName: string
}

export default function ResearchHeader({ projectName }: ResearchHeaderProps) {
  return (
    <div className="research-header">
      <div className="header-left">
        <span className="header-project-name">Project Name : {projectName}</span>
      </div>
      <div className="header-divider" />
      <div className="header-right">
        <span className="header-summary-title">Summary</span>
      </div>
      <style>{`
        .research-header {
          display: flex;
          align-items: center;
          height: 47px;
          border-bottom: 1px solid rgba(128, 128, 128, 0.2);
          flex-shrink: 0;
        }
        .header-left {
          flex: 0 0 548px;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }
        .header-project-name {
          font-family: 'Pretendard', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(246, 248, 255, 0.7);
          white-space: nowrap;
          line-height: 1.4;
        }
        .header-divider {
          width: 1px;
          height: 100%;
          background: rgba(128, 128, 128, 0.2);
          flex-shrink: 0;
        }
        .header-right {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }
        .header-summary-title {
          font-family: 'Pretendard', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: rgba(246, 248, 255, 0.7);
          line-height: 1.4;
        }
      `}</style>
    </div>
  )
}
