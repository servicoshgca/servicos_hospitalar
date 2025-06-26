'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Upload, Image, Video, X } from 'lucide-react';

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
}

export default function NovaNoticiaPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    conteudo: '',
    imagem: '',
    videoUrl: '',
    autorId: '',
    publicada: false,
  });
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/funcionarios', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar funcionários');
      }

      const data = await response.json();
      setFuncionarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar funcionários');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setSelectedImage(file);
    setError(null);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload automático
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        imagem: data.url,
      }));
      
      // Limpar preview e arquivo selecionado após upload bem-sucedido
      setSelectedImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem');
      // Limpar arquivo selecionado em caso de erro
      setSelectedImage(null);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imagem: '',
    }));
  };

  const validateYoutubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const handleVideoUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      videoUrl: url,
    }));

    if (url && !validateYoutubeUrl(url)) {
      setError('Por favor, insira uma URL válida do YouTube');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar URL do YouTube se fornecida
    if (formData.videoUrl && !validateYoutubeUrl(formData.videoUrl)) {
      setError('Por favor, insira uma URL válida do YouTube');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/ascom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar notícia');
      }

      router.push('/sistemas/ascom');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar notícia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Nova Notícia</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Criar Nova Notícia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Digite o título da notícia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitulo">Subtítulo</Label>
                <Input
                  id="subtitulo"
                  value={formData.subtitulo}
                  onChange={(e) => handleInputChange('subtitulo', e.target.value)}
                  placeholder="Digite o subtítulo (opcional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo *</Label>
              <Textarea
                id="conteudo"
                value={formData.conteudo}
                onChange={(e) => handleInputChange('conteudo', e.target.value)}
                placeholder="Digite o conteúdo da notícia"
                rows={10}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="autor">Autor *</Label>
                <select
                  id="autor"
                  value={formData.autorId}
                  onChange={(e) => handleInputChange('autorId', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um autor</option>
                  {funcionarios.map((funcionario) => (
                    <option key={funcionario.id} value={funcionario.id}>
                      {funcionario.nome} - {funcionario.cpf}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">Link do Vídeo (YouTube)</Label>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-500" />
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Cole aqui o link completo do vídeo do YouTube
                </p>
              </div>
            </div>

            {/* Seção de Upload de Imagem */}
            <div className="space-y-4">
              <Label>Imagem da Notícia</Label>
              
              {!selectedImage && !formData.imagem && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Clique para selecionar uma imagem ou arraste aqui
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="flex items-center gap-2"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Upload className="w-4 h-4 animate-spin" />
                          Fazendo upload...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Selecionar Imagem
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {selectedImage && (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      disabled={uploading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeImage}
                      disabled={uploading}
                    >
                      Cancelar
                    </Button>
                  </div>
                  {uploading && (
                    <p className="text-sm text-blue-600">Fazendo upload da imagem...</p>
                  )}
                </div>
              )}

              {formData.imagem && (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">✓ Imagem carregada com sucesso</p>
                  <div className="relative inline-block">
                    <img
                      src={formData.imagem}
                      alt="Imagem carregada"
                      className="w-32 h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="publicada"
                checked={formData.publicada}
                onCheckedChange={(checked) => handleInputChange('publicada', checked)}
              />
              <Label htmlFor="publicada">Publicar imediatamente</Label>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.titulo || !formData.conteudo || !formData.autorId || uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  'Salvando...'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Notícia
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 