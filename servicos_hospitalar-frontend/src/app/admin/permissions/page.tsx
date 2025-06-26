'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Users, Shield } from 'lucide-react';

interface User {
  id: string;
  funcionario: {
    nome: string;
    cpf: string;
  };
}

interface Sistema {
  id: string;
  nome: string;
  descricao?: string;
}

interface Perfil {
  id: string;
  nome: string;
  nivel: number;
  descricao?: string;
}

interface Permission {
  id: string;
  user: {
    id: string;
    funcionario: {
      nome: string;
      cpf: string;
    };
  };
  sistema: {
    id: string;
    nome: string;
  };
  perfil: {
    id: string;
    nome: string;
    nivel: number;
  };
  ativo: boolean;
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({
    userId: '',
    sistemaId: '',
    perfilId: '',
    ativo: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [permissionsRes, availableDataRes] = await Promise.all([
        fetch('http://localhost:3001/permissions', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('http://localhost:3001/permissions/available-data', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!permissionsRes.ok || !availableDataRes.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const [permissionsData, availableData] = await Promise.all([
        permissionsRes.json(),
        availableDataRes.json(),
      ]);

      setPermissions(permissionsData);
      setUsers(availableData.users);
      setSistemas(availableData.sistemas);
      setPerfis(availableData.perfis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingPermission 
        ? `http://localhost:3001/permissions/${editingPermission.id}`
        : 'http://localhost:3001/permissions';
      
      const method = editingPermission ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar permissão');
      }

      setShowForm(false);
      setEditingPermission(null);
      setFormData({ userId: '', sistemaId: '', perfilId: '', ativo: true });
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar permissão');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({
      userId: permission.user.id,
      sistemaId: permission.sistema.id,
      perfilId: permission.perfil.id,
      ativo: permission.ativo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta permissão?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/permissions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao remover permissão');
      }

      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover permissão');
    }
  };

  const getNivelText = (nivel: number) => {
    switch (nivel) {
      case 1: return 'Usuário Comum';
      case 2: return 'Gestor';
      case 3: return 'Administrador';
      default: return 'Desconhecido';
    }
  };

  const getNivelColor = (nivel: number) => {
    switch (nivel) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando permissões...</div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Permissões</h1>
          <p className="text-gray-600">Gerencie as permissões de acesso dos usuários aos sistemas</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Permissão
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingPermission ? 'Editar Permissão' : 'Nova Permissão'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="userId">Usuário *</Label>
                  <select
                    id="userId"
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.funcionario.nome} - {user.funcionario.cpf}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="sistemaId">Sistema *</Label>
                  <select
                    id="sistemaId"
                    value={formData.sistemaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, sistemaId: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um sistema</option>
                    {sistemas.map((sistema) => (
                      <option key={sistema.id} value={sistema.id}>
                        {sistema.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="perfilId">Perfil *</Label>
                  <select
                    id="perfilId"
                    value={formData.perfilId}
                    onChange={(e) => setFormData(prev => ({ ...prev, perfilId: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione um perfil</option>
                    {perfis.map((perfil) => (
                      <option key={perfil.id} value={perfil.id}>
                        {perfil.nome} (Nível {perfil.nivel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="ativo">Ativo</Label>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPermission(null);
                    setFormData({ userId: '', sistemaId: '', perfilId: '', ativo: true });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.userId || !formData.sistemaId || !formData.perfilId}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Salvando...' : (editingPermission ? 'Atualizar' : 'Criar')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Permissões */}
      <div className="grid gap-4">
        {permissions.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center">Nenhuma permissão encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          permissions.map((permission) => (
            <Card key={permission.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{permission.user.funcionario.nome}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelColor(permission.perfil.nivel)}`}>
                        {getNivelText(permission.perfil.nivel)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        permission.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {permission.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">CPF: {permission.user.funcionario.cpf}</p>
                    <p className="text-gray-600 mb-1">Sistema: {permission.sistema.nome}</p>
                    <p className="text-gray-600">Perfil: {permission.perfil.nome}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(permission)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(permission.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 