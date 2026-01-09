
import { GoogleGenAI } from "@google/genai";
import { ImageData } from "../types";

export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window.aistudio?.hasSelectedApiKey !== 'function') return true;
  return await window.aistudio.hasSelectedApiKey();
};

export const openApiKeySelector = async (): Promise<void> => {
  if (typeof window.aistudio?.openSelectKey !== 'function') return;
  await window.aistudio.openSelectKey();
};

export const generateTimelapse = async (
  beforeImage: ImageData,
  afterImage: ImageData,
  prompt: string,
  onProgress: (msg: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  onProgress("Initializing generative session...");
  
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A cinematic architectural timelapse. ${prompt}. High quality, stable camera, progressive construction, realistic lighting, sharp geometry, 100% room coverage, step-by-step transformation.`,
    image: {
      imageBytes: beforeImage.base64,
      mimeType: beforeImage.mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16',
      lastFrame: {
        imageBytes: afterImage.base64,
        mimeType: afterImage.mimeType,
      },
    }
  });

  const progressMessages = [
    "Analyzing spatial geometry...",
    "Calculating lighting transitions...",
    "Simulating material metamorphosis...",
    "Rendering temporal frames...",
    "Optimizing cinematic motion...",
    "Applying ultra-realistic shadows...",
    "Finalizing architectural details...",
    "Encoding 9:16 cinematic output..."
  ];

  let msgIndex = 0;
  while (!operation.done) {
    onProgress(progressMessages[msgIndex % progressMessages.length]);
    msgIndex++;
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.response?.generatedVideos?.[0]?.video?.uri) {
    const downloadLink = operation.response.generatedVideos[0].video.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  throw new Error("Failed to generate video");
};
