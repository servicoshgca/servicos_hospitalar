'use client';

import { useState, useEffect } from 'react';
import { GPService, Vinculo } from '../services/gpService';
import ImageUpload from './ImageUpload';

interface CreateVinculoDto {
  nome: string;
  imagem?: string;
  ativo?: boolean;
}

interface UpdateVinculoDto extends Partial<CreateVinculoDto> {}

export default function VinculosList() {
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVinculo, setEditingVinculo] = useState<Vinculo | null>(null);

  const [formData, setFormData] = useState<CreateVinculoDto>({
    nome: '',
    imagem: '',
  });

  useEffect(() => {
    loadVinculos();
  }, []);

  const loadVinculos = async () => {
    try {
      setLoading(true);
      const data = await GPService.getVinculos();
      setVinculos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vínculos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVinculo) {
        await GPService.updateVinculo(editingVinculo.id, formData);
      } else {
        await GPService.createVinculo(formData);
      }
      setShowForm(false);
      setEditingVinculo(null);
      setFormData({ nome: '', imagem: '' });
      loadVinculos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar vínculo');
    }
  };

  const handleEdit = (vinculo: Vinculo) => {
    setEditingVinculo(vinculo);
    setFormData({
      nome: vinculo.nome,
      imagem: vinculo.imagem || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este vínculo?')) {
      try {
        await GPService.deleteVinculo(id);
        loadVinculos();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar vínculo');
      }
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, imagem: url });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Carregando vínculos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Vínculos</h3>
          <p className="text-sm text-gray-600">
            {vinculos.length} vínculo{vinculos.length !== 1 ? 's' : ''} cadastrado{vinculos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
        >
          <span>🔗</span>
          <span>Novo Vínculo</span>
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
            {editingVinculo ? 'Editar Vínculo' : 'Novo Vínculo'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Vínculo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={formData.imagem}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingVinculo(null);
                  setFormData({ nome: '', imagem: '' });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {editingVinculo ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vinculos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">🔗</div>
              <p className="text-lg font-medium">Nenhum vínculo cadastrado</p>
              <p className="text-sm">Clique em "Novo Vínculo" para começar</p>
            </div>
          </div>
        ) : (
          vinculos.map((vinculo) => (
            <div key={vinculo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {vinculo.imagem && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={vinculo.imagem}
                    alt={vinculo.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 text-center">{vinculo.nome}</h3>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(vinculo)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vinculo.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Excluir
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