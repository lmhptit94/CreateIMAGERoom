
export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface GenerationStatus {
  progress: number;
  message: string;
  isError: boolean;
}

export interface VideoResult {
  url: string;
}
