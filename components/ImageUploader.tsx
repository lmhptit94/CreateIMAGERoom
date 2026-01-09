
import React from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  label: string;
  image: ImageData | null;
  onUpload: (data: ImageData) => void;
  description: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onUpload, description }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        onUpload({
          base64,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div 
        className={`relative h-64 w-full rounded-2xl border-2 border-dashed transition-all duration-300 group overflow-hidden ${
          image ? 'border-blue-500/50' : 'border-gray-700 hover:border-gray-500'
        } bg-[#111]`}
      >
        {image ? (
          <img 
            src={`data:${image.mimeType};base64,${image.base64}`} 
            className="w-full h-full object-cover" 
            alt={label} 
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mb-3 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-gray-300">Upload Image</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleFileChange}
        />
        {image && (
          <div className="absolute top-2 right-2">
            <button 
              onClick={(e) => { e.preventDefault(); onUpload(null as any); }}
              className="bg-black/50 hover:bg-black/80 p-2 rounded-full backdrop-blur-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
