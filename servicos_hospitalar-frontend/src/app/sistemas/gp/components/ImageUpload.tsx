'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

export default function ImageUpload({ onImageUpload, currentImage, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:3001/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const result = await response.json();
      onImageUpload(result.url);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Imagem do Setor
      </label>
      
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
        >
          {isUploading ? (
            <>
              <span>⏳</span>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <span>📷</span>
              <span>Selecionar Imagem</span>
            </>
          )}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Remover
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: 5MB.
      </p>
    </div>
  );
} 