import { useEffect } from 'react'
import { useProjectStore } from '../store/useProjectStore'

export function useProjectList(userId?: string) {
  const projects = useProjectStore((s) => s.projects)
  const loading = useProjectStore((s) => s.loading)
  const error = useProjectStore((s) => s.error)
  const fetchProjects = useProjectStore((s) => s.fetchProjects)
  const createProject = useProjectStore((s) => s.createProject)
  const deleteProject = useProjectStore((s) => s.deleteProject)

  useEffect(() => {
    fetchProjects(userId)
  }, [userId, fetchProjects])

  return { projects, loading, error, createProject, deleteProject }
}

export function useProjectDetail(projectId: string) {
  const currentProject = useProjectStore((s) => s.currentProject)
  const loading = useProjectStore((s) => s.loading)
  const error = useProjectStore((s) => s.error)
  const fetchProject = useProjectStore((s) => s.fetchProject)

  useEffect(() => {
    fetchProject(projectId)
  }, [projectId, fetchProject])

  return { currentProject, loading, error }
}
