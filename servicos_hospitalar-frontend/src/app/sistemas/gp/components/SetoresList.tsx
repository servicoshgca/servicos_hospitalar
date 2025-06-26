'use client';

import { useState, useEffect } from 'react';
import { GPService, Setor } from '../services/gpService';
import ImageUpload from './ImageUpload';
import FuncionariosSetor from './FuncionariosSetor';

interface CreateSetorDto {
  nome: string;
  descricao?: string;
  imagem?: string;
  telefone?: string;
  email?: string;
  coordenador?: string;
  ativo?: boolean;
}

interface UpdateSetorDto extends Partial<CreateSetorDto> {}

export default function SetoresList() {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSetor, setEditingSetor] = useState<Setor | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<Setor | null>(null);

  const [formData, setFormData] = useState<CreateSetorDto>({
    nome: '',
    descricao: '',
    imagem: '',
    telefone: '',
    email: '',
    coordenador: '',
  });

  useEffect(() => {
    loadSetores();
  }, []);

  const loadSetores = async () => {
    try {
      setLoading(true);
      const data = await GPService.getSetores();
      setSetores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSetor) {
        await GPService.updateSetor(editingSetor.id, formData);
      } else {
        await GPService.createSetor(formData);
      }
      setShowForm(false);
      setEditingSetor(null);
      setFormData({ nome: '', descricao: '', imagem: '', telefone: '', email: '', coordenador: '' });
      loadSetores();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar setor');
    }
  };

  const handleEdit = (setor: Setor) => {
    setEditingSetor(setor);
    setFormData({
      nome: setor.nome,
      descricao: setor.descricao || '',
      imagem: setor.imagem || '',
      telefone: setor.telefone || '',
      email: setor.email || '',
      coordenador: setor.coordenador || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este setor?')) {
      try {
        await GPService.deleteSetor(id);
        loadSetores();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar setor');
      }
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imagem: url });
  };

  const handleSetorClick = (setor: Setor) => {
    setSelectedSetor(setor);
  };

  const handleBackToSetores = () => {
    setSelectedSetor(null);
  };

  // Se um setor foi selecionado, mostrar os funcionários
  if (selectedSetor) {
    return (
      <FuncionariosSetor
        setorId={selectedSetor.id}
        setorNome={selectedSetor.nome}
        onBack={handleBackToSetores}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Carregando setores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Setores</h3>
          <p className="text-sm text-gray-600">
            {setores.length} setor{setores.length !== 1 ? 'es' : ''} cadastrado{setores.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
        >
          <span>🏢</span>
          <span>Novo Setor</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {editingSetor ? 'Editar Setor' : 'Novo Setor'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Setor *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coordenador/Diretoria</label>
                <input
                  type="text"
                  value={formData.coordenador}
                  onChange={(e) => setFormData({ ...formData, coordenador: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="setor@hospital.com"
                />
              </div>
              <div className="md:col-span-2">
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={formData.imagem}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Descrição detalhada do setor..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSetor(null);
                  setFormData({ nome: '', descricao: '', imagem: '', telefone: '', email: '', coordenador: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {editingSetor ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setores.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">🏢</div>
              <p className="text-lg font-medium">Nenhum setor cadastrado</p>
              <p className="text-sm">Clique em "Novo Setor" para começar</p>
            </div>
          </div>
        ) : (
          setores.map((setor) => (
            <div 
              key={setor.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSetorClick(setor)}
            >
              {setor.imagem && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={setor.imagem}
                    alt={setor.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{setor.nome}</h3>
                {setor.coordenador && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Coordenador:</span> {setor.coordenador}
                  </p>
                )}
                {setor.telefone && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Telefone:</span> {setor.telefone}
                  </p>
                )}
                {setor.email && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> {setor.email}
                  </p>
                )}
                {setor.descricao && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{setor.descricao}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    setor.ativo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {setor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(setor);
                      }}
                      className="text-green-600 hover:text-green-900 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(setor.id);
                      }}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetorClick(setor);
                    }}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <span>👥</span>
                    <span>Ver Funcionários</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 