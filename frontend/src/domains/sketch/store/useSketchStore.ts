import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Sketch, CreateSketchDto } from '../model/Sketch'
import { sketchApi } from '../service/sketchApi'

export const useSketchStore = defineStore('sketch', () => {
  const sketches = ref<Sketch[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSketches(projectId: string) {
    loading.value = true
    error.value = null
    try {
      sketches.value = await sketchApi.getByProjectId(projectId)
    } catch (e) {
      error.value = 'Failed to fetch sketches'
    } finally {
      loading.value = false
    }
  }

  async function addSketch(dto: CreateSketchDto) {
    const sketch = await sketchApi.create(dto)
    sketches.value.push(sketch)
    return sketch
  }

  async function uploadSketch(projectId: string, file: File) {
    const sketch = await sketchApi.upload(projectId, file)
    sketches.value.push(sketch)
    return sketch
  }

  async function removeSketch(id: string) {
    await sketchApi.delete(id)
    sketches.value = sketches.value.filter((s) => s.id !== id)
  }

  return { sketches, loading, error, fetchSketches, addSketch, uploadSketch, removeSketch }
})
