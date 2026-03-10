import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'
import type { User } from '../model/User'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        const user: User = JSON.parse(decodeURIComponent(data))
        setUser(user)
        navigate('/', { replace: true })
      } catch {
        navigate('/login?error=oauth_failed', { replace: true })
      }
    } else {
      navigate('/login?error=oauth_failed', { replace: true })
    }
  }, [searchParams, setUser, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-text-secondary text-[0.9375rem]">
      <div className="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin-slow" />
      <p>Signing in...</p>
    </div>
  )
}
