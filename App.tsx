
import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import { ImageData } from './types';
import { generateTimelapse, checkApiKey, openApiKeySelector } from './services/videoService';

const App: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<ImageData | null>(null);
  const [afterImage, setAfterImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const init = async () => {
      const keyExists = await checkApiKey();
      setHasKey(keyExists);
    };
    init();
  }, []);

  const handleGenerate = async () => {
    if (!beforeImage || !afterImage) {
      setError("Please upload both 'Before' and 'After' images.");
      return;
    }

    const keyExists = await checkApiKey();
    if (!keyExists) {
      await openApiKeySelector();
      setHasKey(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    
    try {
      const url = await generateTimelapse(
        beforeImage, 
        afterImage, 
        prompt || "A seamless architectural transition.",
        (msg) => setProgressMsg(msg)
      );
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("Requested entity was not found")) {
        setError("API Key issue detected. Please re-select your key.");
        setHasKey(false);
      } else {
        setError("Generation failed. Please try a different prompt or check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenKey = async () => {
    await openApiKeySelector();
    setHasKey(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Temporal Architect
          </h1>
          <p className="text-gray-400 mt-2 text-lg font-light">
            Cinematic AI-driven timelapse from Before to After.
          </p>
        </div>
        
        {!hasKey && (
          <button 
            onClick={handleOpenKey}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-6 py-2 rounded-full border border-amber-500/20 transition-all text-sm font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Select Paid API Key (Required for Veo)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-8 glass-effect p-8 rounded-3xl">
          <div className="flex gap-4">
            <ImageUploader 
              label="Before Frame" 
              image={beforeImage} 
              onUpload={setBeforeImage}
              description="Initial state of the room"
            />
            <ImageUploader 
              label="After Frame" 
              image={afterImage} 
              onUpload={setAfterImage}
              description="Final completed project"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Process Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A minimalist kitchen renovation with marble counters and wood cabinetry being installed progressively."
              className="w-full h-32 bg-[#111] border border-gray-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isLoading || !beforeImage || !afterImage}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
              isLoading || !beforeImage || !afterImage
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create Cinematic Timelapse
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm animate-pulse">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-800/50">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Specifications</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-xs text-gray-400 flex flex-col">
                <span className="font-semibold text-gray-300">Format</span>
                Vertical (9:16)
              </div>
              <div className="text-xs text-gray-400 flex flex-col">
                <span className="font-semibold text-gray-300">Style</span>
                Architectural Cinematic
              </div>
              <div className="text-xs text-gray-400 flex flex-col">
                <span className="font-semibold text-gray-300">Model</span>
                Gemini Veo 3.1
              </div>
              <div className="text-xs text-gray-400 flex flex-col">
                <span className="font-semibold text-gray-300">Order</span>
                Logical Progression
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="glass-effect rounded-[2.5rem] p-6 flex-1 min-h-[600px] flex flex-col items-center justify-center relative group">
            {isLoading ? (
              <div className="text-center space-y-6 max-w-sm">
                <div className="relative inline-block">
                  <div className="absolute inset-0 blur-xl bg-blue-500/20 animate-pulse rounded-full" />
                  <div className="animate-spin h-16 w-16 border-4 border-white/10 border-t-white rounded-full relative" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Simulating Transformation</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{progressMsg}</p>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-white animate-[progress_15s_ease-in-out_infinite]" style={{ width: '45%' }} />
                </div>
              </div>
            ) : videoUrl ? (
              <div className="w-full h-full flex flex-col items-center">
                <div className="relative h-full w-full max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/5">
                  <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <a 
                      href={videoUrl} 
                      download="timelapse.mp4"
                      className="bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-md transition-all border border-white/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </div>
                <button 
                  onClick={() => setVideoUrl(null)}
                  className="mt-6 text-gray-500 hover:text-white text-sm transition-colors uppercase tracking-widest font-bold"
                >
                  Clear Results
                </button>
              </div>
            ) : (
              <div className="text-center max-w-sm px-8">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-3">Generation Queue</h3>
                <p className="text-gray-500 text-sm">
                  Upload your project frames to visualize the cinematic journey between states.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="mt-16 text-center text-gray-600 text-xs uppercase tracking-widest">
        Powered by Gemini Veo 3.1 • Advanced Architectural Visualization
      </div>
    </div>
  );
};

export default App;
