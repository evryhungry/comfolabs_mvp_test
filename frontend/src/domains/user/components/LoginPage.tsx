import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import BaseButton from '../../../components/BaseButton'
import BaseInput from '../../../components/BaseInput'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { error, createUser, signIn } = useUser()

  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [oauthError, setOauthError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      setOauthError('Google login failed. Please try again.')
    }
  }, [searchParams])

  function handleGoogleLogin() {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    window.location.href = `${backendUrl}/oauth/google`
  }

  async function handleSignUp() {
    if (!name.trim() || !email.trim()) return
    setSubmitting(true)
    try {
      await createUser({ name: name.trim(), email: email.trim() })
      navigate('/')
    } catch {
      // store handles error
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignIn() {
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const user = await signIn(email.trim())
      if (user) navigate('/')
    } catch {
      // store handles error
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode(to: 'signup' | 'signin') {
    setMode(to)
    setName('')
    setEmail('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="bg-surface border border-border rounded-[var(--radius-xl)] py-10 px-9 w-full max-w-[400px] shadow-lg text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <span className="w-10 h-10 bg-gradient-to-br from-primary to-[#a78bfa] rounded-[var(--radius-sm)] flex items-center justify-center text-lg font-extrabold text-white">C</span>
          <span className="text-[1.375rem] font-bold text-text tracking-tight">Comfolabs</span>
        </div>

        {oauthError && <p className="text-[0.8125rem] text-danger text-center -mt-1 mb-0">{oauthError}</p>}

        {/* Google Login */}
        <button
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 border border-border rounded-[var(--radius-md)] bg-surface text-text text-[0.9375rem] font-medium cursor-pointer transition-all duration-200 hover:bg-bg hover:border-text-secondary mt-4"
          onClick={handleGoogleLogin}
        >
          <svg className="shrink-0" viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-border" />
          <span className="text-[0.8125rem] text-text-secondary uppercase tracking-wider">or</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        {mode === 'signup' ? (
          <>
            <p className="text-text-secondary text-[0.9375rem] mb-7">Create your account to get started</p>
            <form className="flex flex-col gap-4 text-left" onSubmit={(e) => { e.preventDefault(); handleSignUp() }}>
              <BaseInput value={name} onChange={setName} label="Name" placeholder="Your name" />
              <BaseInput value={email} onChange={setEmail} label="Email" placeholder="you@example.com" type="email" />
              {error && <p className="text-[0.8125rem] text-danger text-center -my-1">{error}</p>}
              <BaseButton
                label="Get Started"
                size="lg"
                loading={submitting}
                disabled={!name.trim() || !email.trim()}
                onClick={handleSignUp}
              />
            </form>
            <p className="mt-5 text-[0.8125rem] text-text-secondary text-center">
              Already have an account?{' '}
              <button className="bg-none border-none text-primary font-semibold text-[0.8125rem] cursor-pointer p-0 transition-colors duration-200 hover:text-primary-hover" onClick={() => switchMode('signin')}>Sign In</button>
            </p>
          </>
        ) : (
          <>
            <p className="text-text-secondary text-[0.9375rem] mb-7">Sign in with your email</p>
            <form className="flex flex-col gap-4 text-left" onSubmit={(e) => { e.preventDefault(); handleSignIn() }}>
              <BaseInput value={email} onChange={setEmail} label="Email" placeholder="you@example.com" type="email" />
              {error && <p className="text-[0.8125rem] text-danger text-center -my-1">{error}</p>}
              <BaseButton
                label="Sign In"
                size="lg"
                loading={submitting}
                disabled={!email.trim()}
                onClick={handleSignIn}
              />
            </form>
            <p className="mt-5 text-[0.8125rem] text-text-secondary text-center">
              Don't have an account?{' '}
              <button className="bg-none border-none text-primary font-semibold text-[0.8125rem] cursor-pointer p-0 transition-colors duration-200 hover:text-primary-hover" onClick={() => switchMode('signup')}>Sign Up</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
