import { useUser } from '../hooks/useUser'

export default function UserProfile() {
  const { currentUser } = useUser()

  if (!currentUser) return null

  return (
    <div className="flex items-center gap-2.5 py-2 px-3 bg-white/6 rounded-[var(--radius-md)]">
      <div className="w-[34px] h-[34px] bg-gradient-to-br from-primary to-[#a78bfa] rounded-full flex items-center justify-center text-[0.8125rem] font-bold text-white shrink-0">
        {currentUser.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[0.8125rem] font-semibold text-header-text leading-tight">{currentUser.name}</span>
        <span className="text-[0.6875rem] text-text-muted overflow-hidden text-ellipsis whitespace-nowrap">{currentUser.email}</span>
      </div>
    </div>
  )
}
