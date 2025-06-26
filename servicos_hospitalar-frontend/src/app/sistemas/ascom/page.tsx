'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Globe, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function AscomPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Token não encontrado');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/ascom', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao carregar notícias');
        return;
      }

      const data = await response.json();
      setNoticias(data);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar notícias');
    }
  };

  const handleDelete = async (id: string) => {
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

      fetchNoticias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir notícia');
    }
  };

  const handlePublish = async (id: string) => {
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

      fetchNoticias();
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
          <div className="text-lg">Carregando notícias...</div>
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar aos Sistemas
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Sistema ASCOM</h1>
        </div>
        <Button 
          onClick={() => router.push('/sistemas/ascom/nova')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      <div className="grid gap-6">
        {noticias.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center">Nenhuma notícia encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          noticias.map((noticia) => (
            <Card key={noticia.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{noticia.titulo}</CardTitle>
                    {noticia.subtitulo && (
                      <p className="text-gray-600 mb-2">{noticia.subtitulo}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Por: {noticia.autor.nome}</span>
                      <span>Setor: {noticia.autor.informacoesFuncionais[0]?.setor.nome}</span>
                      <span>Criada em: {formatDate(noticia.createdAt)}</span>
                      {noticia.publicada && noticia.dataPublicacao && (
                        <span>Publicada em: {formatDate(noticia.dataPublicacao)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/sistemas/ascom/${noticia.id}`)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(noticia.id)}
                        disabled={noticia.publicada}
                      >
                        {noticia.publicada ? 'Publicada' : 'Publicar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(noticia.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    noticia.publicada 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {noticia.publicada ? 'Publicada' : 'Rascunho'}
                  </span>
                </div>
                <p className="text-gray-700 line-clamp-3">
                  {noticia.conteudo.substring(0, 200)}...
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 