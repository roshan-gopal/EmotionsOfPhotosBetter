'use client';
import { useState, ChangeEvent } from 'react';

interface UploadPhotoSectionProps {
  onUpload: (url: string) => void;
}

const UploadPhotoSection = ({ onUpload }: UploadPhotoSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Automatically trigger upload
      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        onUpload(data.url);
      } catch (err) {
        setError('Failed to upload image. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Photo</h2>
        <p className="text-gray-600 mb-4">
          Choose a photo to upload. Supported formats: JPG, PNG, GIF (max 5MB)
        </p>
        
        <label className="relative block w-12 h-12 mx-auto mb-4 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="hidden"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100">
            <span className="text-blue-700 text-3xl font-bold">+</span>
          </div>
        </label>

        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default UploadPhotoSection;
