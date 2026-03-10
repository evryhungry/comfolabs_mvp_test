import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProjectList } from '../hooks/useProject'
import { useUser } from '../../user/hooks/useUser'
import BaseButton from '../../../components/BaseButton'
import BaseInput from '../../../components/BaseInput'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ProjectList() {
  const navigate = useNavigate()
  const { currentUser } = useUser()
  const { projects, loading, error, createProject } = useProjectList(currentUser?.id)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    if (!newTitle.trim() || !currentUser) return
    setCreating(true)
    try {
      const project = await createProject({
        userId: currentUser.id,
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
      })
      setShowCreateModal(false)
      setNewTitle('')
      setNewDescription('')
      navigate(`/project/${project.id}`)
    } catch {
      // handled by store
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-[960px] mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1>My Projects</h1>
          <p className="text-text-secondary text-[0.9375rem] mt-1">Manage your industrial design rendering projects</p>
        </div>
        <BaseButton label="+ New Project" onClick={() => setShowCreateModal(true)} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-20 text-text-muted">
          <div className="w-9 h-9 border-3 border-border border-t-primary rounded-full animate-spin-slow" />
          <p>Loading projects...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-3 py-20 text-danger">
          <div className="w-12 h-12 bg-danger-light rounded-full flex items-center justify-center text-2xl font-bold">!</div>
          <p>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="text-text-muted mb-2">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-text">No projects yet</h3>
          <p className="text-text-secondary mb-2">Create your first rendering project to get started</p>
          <BaseButton label="Create Project" onClick={() => setShowCreateModal(true)} />
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden flex flex-col transition-all duration-200 no-underline text-inherit hover:border-primary-subtle hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="h-1 bg-gradient-to-r from-primary to-[#a78bfa]" />
              <div className="py-5 px-5 pb-3 flex-1">
                <h3 className="text-[1.0625rem] font-semibold text-text mb-1.5">{project.title}</h3>
                {project.description ? (
                  <p className="text-[0.8375rem] text-text-secondary leading-relaxed line-clamp-2">{project.description}</p>
                ) : (
                  <p className="text-[0.8375rem] text-text-muted italic line-clamp-2">No description</p>
                )}
              </div>
              <div className="py-3 px-5 border-t border-border-light flex items-center justify-between">
                <span className="text-xs text-text-muted">{formatDate(project.createdAt)}</span>
                <span className="text-lg text-text-muted transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(15,23,42,0.5)] backdrop-blur-[4px] flex items-center justify-center z-[1000] animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setShowCreateModal(false) }}>
          <div className="bg-surface rounded-[var(--radius-xl)] w-full max-w-[480px] shadow-xl animate-slide-up">
            <div className="flex items-center justify-between pt-6 px-6">
              <h2>New Project</h2>
              <button className="w-8 h-8 border-none bg-transparent text-2xl text-text-muted rounded-[var(--radius-sm)] flex items-center justify-center transition-all duration-200 hover:bg-bg hover:text-text" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>
            <div className="p-5 px-6 flex flex-col gap-4">
              <BaseInput value={newTitle} onChange={setNewTitle} label="Project Title" placeholder="e.g. Smart Speaker Concept" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.8125rem] font-semibold text-text-secondary">Description (optional)</label>
                <textarea
                  className="py-2.5 px-3.5 border border-border rounded-[var(--radius-md)] text-sm text-text bg-surface resize-y outline-none transition-all duration-200 placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]"
                  placeholder="Brief description of your project..."
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="py-4 px-6 pb-6 flex justify-end gap-2.5">
              <BaseButton label="Cancel" variant="secondary" onClick={() => setShowCreateModal(false)} />
              <BaseButton label="Create Project" loading={creating} disabled={!newTitle.trim()} onClick={handleCreate} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
