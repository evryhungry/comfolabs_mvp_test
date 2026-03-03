export class MoodboardDomainService {
  isReadyForRendering(imageUrls: string[], combinedUrl?: string): boolean {
    return imageUrls.length > 0 && !!combinedUrl;
  }
}
