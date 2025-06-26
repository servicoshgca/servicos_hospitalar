'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiposEtiquetasService, TipoEtiqueta, IconeDisponivel } from '../services/tiposEtiquetasService';

export default function TiposEtiquetasList() {
  const [tiposEtiquetas, setTiposEtiquetas] = useState<TipoEtiqueta[]>([]);
  const [icones, setIcones] = useState<IconeDisponivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    icone: '',
    descricao: '',
    cor: '#3B82F6',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tiposData, iconesData] = await Promise.all([
        TiposEtiquetasService.findAll(),
        TiposEtiquetasService.getIconesDisponiveis(),
      ]);
      setTiposEtiquetas(tiposData);
      setIcones(iconesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await TiposEtiquetasService.update(editingId, formData);
      } else {
        await TiposEtiquetasService.create(formData);
      }
      setEditingId(null);
      setFormData({ nome: '', icone: '', descricao: '', cor: '#3B82F6' });
      loadData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleEdit = (tipo: TipoEtiqueta) => {
    setEditingId(tipo.id);
    setFormData({
      nome: tipo.nome,
      icone: tipo.icone,
      descricao: tipo.descricao || '',
      cor: tipo.cor || '#3B82F6',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tipo de etiqueta?')) {
      try {
        await TiposEtiquetasService.remove(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ nome: '', icone: '', descricao: '', cor: '#3B82F6' });
  };

  const getIconeDisplay = (iconeValue: string) => {
    const icone = icones.find(i => i.value === iconeValue);
    return icone ? icone.icon : iconeValue;
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? 'Editar Tipo de Etiqueta' : 'Novo Tipo de Etiqueta'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icone">Ícone</Label>
                <select
                  id="icone"
                  value={formData.icone}
                  onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione um ícone</option>
                  {icones.map((icone) => (
                    <option key={icone.value} value={icone.value}>
                      {icone.icon} {icone.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input
                  id="cor"
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Etiquetas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiposEtiquetas.map((tipo) => (
              <div
                key={tipo.id}
                className="border rounded-lg p-4 space-y-2"
                style={{ borderLeftColor: tipo.cor || '#3B82F6', borderLeftWidth: '4px' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getIconeDisplay(tipo.icone)}</span>
                    <h3 className="font-semibold">{tipo.nome}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(tipo)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(tipo.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
                {tipo.descricao && (
                  <p className="text-sm text-gray-600">{tipo.descricao}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Cor: {tipo.cor}</span>
                  <span>•</span>
                  <span>Ícone: {tipo.icone}</span>
                </div>
              </div>
            ))}
          </div>
          {tiposEtiquetas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum tipo de etiqueta encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 