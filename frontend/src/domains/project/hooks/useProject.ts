import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '../store/useProjectStore'

export function useProjectList(userId?: string) {
  const store = useProjectStore()
  const { projects, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.fetchProjects(userId)
  })

  return {
    projects,
    loading,
    error,
    createProject: store.createProject,
    deleteProject: store.deleteProject,
  }
}

export function useProjectDetail(projectId: string) {
  const store = useProjectStore()
  const { currentProject, loading, error } = storeToRefs(store)

  onMounted(() => {
    store.fetchProject(projectId)
  })

  return { currentProject, loading, error }
}
