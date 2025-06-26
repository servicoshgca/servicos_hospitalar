'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useUser } from './contexts/UserContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  matricula: string;
  setor?: {
    id: string;
    nome: string;
    descricao?: string;
  } | null;
}

interface Permissao {
  id: string;
  sistema: {
    id: string;
    nome: string;
    descricao?: string;
  };
  perfil: {
    id: string;
    nome: string;
    nivel: number;
  };
}

interface User {
  id: string;
  funcionario: Funcionario;
  permissoes: Permissao[];
}

interface Sistema {
  id: string;
  nome: string;
  descricao?: string;
  nivel: number;
}

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

export default function Home() {
  const { user } = useUser();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Carregar notícias públicas
    fetchNoticias();
    setInitialLoading(false);
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await fetch('http://localhost:3001/ascom/public');
      
      if (response.ok) {
        const data = await response.json();
        setNoticias(data);
      }
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          {/* Links Externos - Primeiro e destacados */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="#" className="text-white hover:text-blue-100 transition-colors text-base font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              AGHUSE
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors text-base font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              ABRIR CHAMADOS - GLPI
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors text-base font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              RBD IMAGENS
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors text-base font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              LABCHECAP
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors text-base font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              RESIDÊNCIA CIRURGICA
            </a>
            <a href="#" className="text-white hover:text-blue-100 transition-colors text-base font-medium px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
              PROTOCOLOS OPERACIONAIS
            </a>
          </div>
          
          {/* Título Principal */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sistema de Serviços Hospitalares
          </h1>
        </div>
      </section>

      {/* Notícias Section */}
      {noticias.length > 0 && (
        <section className={`py-12 ${user ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Últimas Notícias</h2>
              <p className="text-gray-600 text-lg">Fique por dentro das novidades do hospital</p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 8000, disableOnInteraction: false }}
                loop={true}
                className="noticias-slideshow"
              >
                {noticias.map((noticia) => (
                  <SwiperSlide key={noticia.id}>
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Lado esquerdo - Imagem */}
                        {noticia.imagem && (
                          <div className="relative h-64 lg:h-full min-h-[400px]">
                            <img
                              src={noticia.imagem}
                              alt={noticia.titulo}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay gradiente sutil */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                        )}
                        
                        {/* Lado direito - Conteúdo */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="space-y-6">
                            {/* Meta informações */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Publicada
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(noticia.dataPublicacao || noticia.createdAt)}
                              </span>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                              {noticia.titulo}
                            </h3>
                            
                            {/* Subtítulo */}
                            {noticia.subtitulo && (
                              <p className="text-lg text-gray-600 leading-relaxed">
                                {noticia.subtitulo}
                              </p>
                            )}
                            
                            {/* Resumo */}
                            <p className="text-gray-700 leading-relaxed">
                              {noticia.conteudo.substring(0, 200)}...
                            </p>
                            
                            {/* Autor e botão */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{noticia.autor.nome}</p>
                                  <p className="text-sm text-gray-500">Autor</p>
                                </div>
                              </div>
                              
                              <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => window.open(`/sistemas/ascom/${noticia.id}`, '_blank')}
                              >
                                Ler mais
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>
      )}

      {/* Acesse Também Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acesse Também</h2>
            <p className="text-gray-500 text-sm">Recursos adicionais</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Link 1 */}
            <a 
              href="#" 
              className="group bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop"
                  alt="Sistema de Gestão"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  Sistema de Gestão
                </h3>
                <p className="text-gray-500 text-xs">
                  Acesse o sistema principal
                </p>
              </div>
            </a>

            {/* Link 2 */}
            <a 
              href="#" 
              className="group bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop"
                  alt="Portal do Paciente"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  Portal do Paciente
                </h3>
                <p className="text-gray-500 text-xs">
                  Área para pacientes
                </p>
              </div>
            </a>

            {/* Link 3 */}
            <a 
              href="#" 
              className="group bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop"
                  alt="Central de Atendimento"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  Central de Atendimento
                </h3>
                <p className="text-gray-500 text-xs">
                  Suporte e informações
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2024 Sistema de Serviços Hospitalares. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
