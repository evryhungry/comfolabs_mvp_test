import { Link, useLocation } from 'react-router-dom'
import { useUserStore } from '../domains/user/store/useUserStore'
import AppRoutes from './router'

export default function App() {
  const currentUser = useUserStore((s) => s.currentUser)
  const logout = useUserStore((s) => s.logout)
  const location = useLocation()

  // Check if current route is a project layout (hideHeader)
  const isProjectLayout = location.pathname.startsWith('/project/')

  return (
    <div id="app" className="flex flex-col min-h-screen">
      {currentUser && !isProjectLayout && (
        <header className="sticky top-0 z-100 bg-header-bg text-header-text border-b border-white/6">
          <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg hover:opacity-85 transition-opacity duration-200">
              <span className="w-8 h-8 bg-gradient-to-br from-primary to-[#a78bfa] rounded-[var(--radius-sm)] flex items-center justify-center text-sm font-extrabold text-white">C</span>
              <span className="tracking-tight">Comfolabs</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 py-1 pl-1 pr-3 bg-white/6 rounded-full">
                <div className="w-[30px] h-[30px] bg-gradient-to-br from-primary to-[#a78bfa] rounded-full flex items-center justify-center text-xs font-bold text-white">{currentUser.name.charAt(0).toUpperCase()}</div>
                <span className="text-[0.8125rem] font-medium text-header-text">{currentUser.name}</span>
              </div>
              <button
                className="w-[34px] h-[34px] border-none bg-transparent text-text-muted rounded-[var(--radius-sm)] flex items-center justify-center transition-all duration-200 hover:bg-white/8 hover:text-white"
                onClick={logout}
                title="Logout"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}
      <main className={
        currentUser && !isProjectLayout
          ? 'flex-1 max-w-[1280px] w-full mx-auto py-8 px-6'
          : 'flex-1'
      }>
        <AppRoutes />
      </main>
    </div>
  )
}
