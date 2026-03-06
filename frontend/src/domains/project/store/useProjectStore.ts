import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project, CreateProjectDto } from '../model/Project'
import { projectApi } from '../service/projectApi'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects(userId?: string) {
    loading.value = true
    error.value = null
    try {
      projects.value = userId
        ? await projectApi.getByUserId(userId)
        : await projectApi.getAll()
    } catch (e) {
      error.value = 'Failed to fetch projects'
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id: string) {
    loading.value = true
    error.value = null
    try {
      currentProject.value = await projectApi.getById(id)
    } catch (e) {
      error.value = 'Failed to fetch project'
    } finally {
      loading.value = false
    }
  }

  async function createProject(dto: CreateProjectDto) {
    const project = await projectApi.create(dto)
    projects.value.unshift(project)
    return project
  }

  async function deleteProject(id: string) {
    await projectApi.delete(id)
    projects.value = projects.value.filter((p) => p.id !== id)
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    deleteProject,
  }
})
