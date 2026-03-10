// TODO: Update endpoints when research API is ready
export const researchApi = {
  async sendMessage(projectId: string, content: string): Promise<string> {
    // Placeholder — replace with actual API call
    return `This is a placeholder response for project ${projectId}. You said: "${content}"`
  },

  async summarize(_projectId: string, messages: string[]): Promise<string> {
    // Placeholder — replace with actual API call
    return messages.join('\n\n') || 'No conversation to summarize yet.'
  },
}
