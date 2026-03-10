import { Routes, Route, Navigate } from 'react-router-dom'
import { type ReactNode } from 'react'
import { useUserStore } from '../domains/user/store/useUserStore'
import { lazy, Suspense } from 'react'

const LoginPage = lazy(() => import('../domains/user/components/LoginPage'))
const OAuthCallback = lazy(() => import('../domains/user/components/OAuthCallback'))
const ProjectList = lazy(() => import('../domains/project/components/ProjectList'))
const ProjectLayout = lazy(() => import('../domains/project/components/ProjectLayout'))
const ResearchPage = lazy(() => import('../domains/research/components/ResearchPage'))
const ProjectCard = lazy(() => import('../domains/project/components/ProjectCard'))
const SketchToCadPage = lazy(() => import('../domains/project/components/SketchToCadPage'))

function ProtectedRoute({ children }: { children: ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const currentUser = useUserStore((s) => s.currentUser)
  if (currentUser) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-9 h-9 border-3 border-border border-t-primary rounded-full animate-spin-slow" /></div>}>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="research" replace />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="render" element={<ProjectCard />} />
          <Route path="sketch-to-cad" element={<SketchToCadPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
