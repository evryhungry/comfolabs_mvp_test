import { create } from 'zustand'
import type { Project, CreateProjectDto } from '../model/Project'
import { projectApi } from '../service/projectApi'
import { ApiError } from '../../../shared/api'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  fetchProjects: (userId?: string) => Promise<void>
  fetchProject: (id: string) => Promise<void>
  createProject: (dto: CreateProjectDto) => Promise<Project>
  deleteProject: (id: string) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,
  error: null,

  async fetchProjects(userId?: string) {
    set({ loading: true, error: null })
    try {
      const projects = userId
        ? await projectApi.getByUserId(userId)
        : await projectApi.getAll()
      set({ projects, loading: false })
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to fetch projects',
        loading: false,
      })
    }
  },

  async fetchProject(id: string) {
    set({ loading: true, error: null })
    try {
      const currentProject = await projectApi.getById(id)
      set({ currentProject, loading: false })
    } catch (e) {
      set({
        error: e instanceof ApiError ? `[${e.errorCode}] ${e.message}` : 'Failed to fetch project',
        loading: false,
      })
    }
  },

  async createProject(dto: CreateProjectDto) {
    const project = await projectApi.create(dto)
    set({ projects: [project, ...get().projects] })
    return project
  },

  async deleteProject(id: string) {
    await projectApi.delete(id)
    set({ projects: get().projects.filter((p) => p.id !== id) })
  },
}))
