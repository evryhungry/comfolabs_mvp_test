const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

export class SketchDomainService {
  isValidImageFile(filename: string): boolean {
    const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
    return ALLOWED_EXTENSIONS.includes(ext);
  }
}
