import { useUserStore } from '../store/useUserStore'

export function useUser() {
  const currentUser = useUserStore((s) => s.currentUser)
  const loading = useUserStore((s) => s.loading)
  const error = useUserStore((s) => s.error)
  const createUser = useUserStore((s) => s.createUser)
  const signIn = useUserStore((s) => s.signIn)
  const setUser = useUserStore((s) => s.setUser)
  const logout = useUserStore((s) => s.logout)

  return { currentUser, loading, error, createUser, signIn, setUser, logout }
}
