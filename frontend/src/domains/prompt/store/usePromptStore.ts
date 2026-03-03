import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Prompt, PromptTemplate, CreatePromptDto } from '../model/Prompt'
import { promptApi } from '../service/promptApi'

export const usePromptStore = defineStore('prompt', () => {
  const prompts = ref<Prompt[]>([])
  const templates = ref<PromptTemplate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPrompts(projectId: string) {
    loading.value = true
    error.value = null
    try {
      prompts.value = await promptApi.getByProjectId(projectId)
    } catch (e) {
      error.value = 'Failed to fetch prompts'
    } finally {
      loading.value = false
    }
  }

  async function fetchTemplates() {
    templates.value = await promptApi.getTemplates()
  }

  async function createPrompt(dto: CreatePromptDto) {
    const prompt = await promptApi.create(dto)
    prompts.value.unshift(prompt)
    return prompt
  }

  return { prompts, templates, loading, error, fetchPrompts, fetchTemplates, createPrompt }
})
