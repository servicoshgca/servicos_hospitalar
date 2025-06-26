'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2, Globe, Edit } from 'lucide-react';

interface Noticia {
  id: string;
  titulo: string;
  subtitulo?: string;
  conteudo: string;
  imagem?: string;
  publicada: boolean;
  dataPublicacao?: string;
  createdAt: string;
  autor: {
    nome: string;
    informacoesFuncionais: Array<{
      setor: {
        nome: string;
      };
    }>;
  };
}

export default function VisualizarNoticiaPage() {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    fetchNoticia();
  }, [id]);

  const fetchNoticia = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/ascom/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar notícia');
      }

      const data = await response.json();
      setNoticia(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notícia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/ascom/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir notícia');
      }

      router.push('/sistemas/ascom');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir notícia');
    }
  };

  const handlePublish = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/ascom/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao publicar notícia');
      }

      fetchNoticia();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar notícia');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando notícia...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Notícia não encontrada.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Visualizar Notícia</h1>
        </div>
        <div className="flex items-center gap-2">
          {!noticia.publicada && (
            <Button
              variant="outline"
              onClick={handlePublish}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Globe className="w-4 h-4 mr-1" />
              Publicar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => router.push(`/sistemas/ascom/${id}/editar`)}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              noticia.publicada 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {noticia.publicada ? 'Publicada' : 'Rascunho'}
            </span>
          </div>
          <CardTitle className="text-2xl">{noticia.titulo}</CardTitle>
          {noticia.subtitulo && (
            <p className="text-gray-600 text-lg">{noticia.subtitulo}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Por: {noticia.autor.nome}</span>
            <span>Setor: {noticia.autor.informacoesFuncionais[0]?.setor.nome}</span>
            <span>Criada em: {formatDate(noticia.createdAt)}</span>
            {noticia.publicada && noticia.dataPublicacao && (
              <span>Publicada em: {formatDate(noticia.dataPublicacao)}</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {noticia.imagem && noticia.imagem.trim() !== '' && (
            <div className="mb-6">
              <img
                src={noticia.imagem}
                alt={noticia.titulo}
                className="w-full max-h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {noticia.conteudo}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 