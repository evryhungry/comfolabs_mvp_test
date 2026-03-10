import iconPolygon from '../../../assets/icons/icon-polygon.svg?raw'

interface StepTooltipProps {
  label: string
}

export default function StepTooltip({ label }: StepTooltipProps) {
  return (
    <span className="step-tooltip">
    	<img className="frameChild" alt="" />
      <span className="polygon-icon" dangerouslySetInnerHTML={{ __html: iconPolygon }} />
      <span className="tooltip-label">{label}</span>
      <style>{`
        .step-tooltip {
          position: absolute;
          left: calc(100% + 25px);
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .step-btn:hover .step-tooltip {
          opacity: 1;
        }
        .frameChild {
            height: 9px;
            width: 9px;
            position: relative;
            border-radius: 1px;
            object-fit: contain;
            z-index: 0;
        }

        .polygon-icon {
            height: 9px;
            width: 100%;
            position: relative;
            border-radius: 1px;
            object-fit: contain;
            margin-right: 2px;
        }

        .tooltip-label {
          background: rgba(246, 248, 255, 0.12);
          border-radius: 7px;
          height: 26px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          font-family: 'Pretendard', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: #f6f8ff;
          white-space: nowrap;
          line-height: 1.4;
        }
      `}</style>
    </span>
  )
}
