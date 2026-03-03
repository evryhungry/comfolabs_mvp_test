import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/useUserStore'

export function useUser() {
  const store = useUserStore()
  const { currentUser, loading, error } = storeToRefs(store)

  return {
    currentUser,
    loading,
    error,
    createUser: store.createUser,
    signIn: store.signIn,
    logout: store.logout,
  }
}
