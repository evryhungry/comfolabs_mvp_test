import { useMemo } from 'react'
import { Outlet, Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import iconPencil from '../../../assets/icons/icon-pencil.svg?raw'
import iconRender from '../../../assets/icons/icon-render.svg?raw'
import icon3d from '../../../assets/icons/icon-3d.svg?raw'
import iconLine4 from '../../../assets/icons/icon-line4.svg?raw'
import StepTooltip from './StepTooltip'

const steps = [
  { name: 'Research', routeName: 'research', icon: iconPencil, tooltip: 'Research' },
  { name: 'Render', routeName: 'render', icon: iconRender, tooltip: 'Rendering' },
  { name: 'Sketch to CAD', routeName: 'sketch-to-cad', icon: icon3d, tooltip: '3D' },
]

export default function ProjectLayout() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const currentStepIndex = useMemo(() => {
    const path = location.pathname
    const idx = steps.findIndex((s) => path.endsWith(`/${s.routeName}`))
    return idx >= 0 ? idx : 0
  }, [location.pathname])

  function navigateTo(routeName: string) {
    navigate(`/project/${id}/${routeName}`)
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link to="/" className="logo" title="Back to Projects">C</Link>
        {/* <div className="divider-h" /> */}
        <nav className="steps">
          {steps.map((step, i) => (
            <div key={step.routeName} className="step-wrapper">
              {i > 0 && <div className="connector" dangerouslySetInnerHTML={{ __html: iconLine4 }} />}
              <button
                className={`step-btn ${currentStepIndex === i ? 'active' : ''}`}
                onClick={() => navigateTo(step.routeName)}
              >
                <span className="step-icon" dangerouslySetInnerHTML={{ __html: step.icon }} />
                <StepTooltip label={step.tooltip} />
              </button>
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
      <style>{`
        .layout {
          display: flex;
          height: 100vh;
          background: #151515;
          color: #f6f8ff;
        }
        .sidebar {
          width: 63px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid rgba(128, 128, 128, 0.2);
          position: relative;
          z-index: 10;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 48px;
          font-size: 23px;
          font-weight: 600;
          color: #f6f8ff;
          text-decoration: none;
          transition: opacity 0.2s;
          padding-top: 15px;
        }
        .logo:hover { opacity: 0.7; }

        .steps {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 21px;
        }
        .step-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .connector {
          width: 2px;
          height: 47px;
          margin: 18px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }
        .connector svg {
          transform: rotate(90deg);
          width: 47px;
          height: 2px;
          flex-shrink: 0;
        }
        .step-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 37px;
          height: 37px;
          border: none;
          background: transparent;
          color: rgba(246, 248, 255, 0.4);
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .step-btn:hover {
          color: rgba(246, 248, 255, 0.7);
          background: rgba(246, 248, 255, 0.06);
        }
        .step-btn.active {
          color: #f6f8ff;
          background: rgba(246, 248, 255, 0.12);
        }
        .step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
        }
        .step-icon svg {
          width: 100%;
          height: 100%;
        }
        .content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}
