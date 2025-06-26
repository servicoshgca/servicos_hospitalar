'use client';

import { useState, useEffect } from 'react';
import { GPService, Funcionario } from '../services/gpService';
import NovoFuncionarioForm from './NovoFuncionarioForm';

export default function FuncionariosList() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const funcionariosData = await GPService.getFuncionarios();
      setFuncionarios(funcionariosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      try {
        await GPService.deleteFuncionario(id);
        loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao deletar funcionário');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">CARREGANDO FUNCIONÁRIOS...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">FUNCIONÁRIOS</h3>
          <p className="text-sm text-gray-600">
            {funcionarios.length} FUNCIONÁRIO{funcionarios.length !== 1 ? 'S' : ''} CADASTRADO{funcionarios.length !== 1 ? 'S' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
        >
          <span>➕</span>
          <span>NOVO FUNCIONÁRIO</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <NovoFuncionarioForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadData();
          }}
        />
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NOME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MATRÍCULA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SETOR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CARGO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {funcionarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">👥</div>
                    <p className="text-lg font-medium">NENHUM FUNCIONÁRIO CADASTRADO</p>
                    <p className="text-sm">CLIQUE EM "NOVO FUNCIONÁRIO" PARA COMEÇAR</p>
                  </div>
                </td>
              </tr>
            ) : (
              funcionarios.map((funcionario) => (
                <tr key={funcionario.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {funcionario.foto && (
                        <img
                          className="h-10 w-10 rounded-full mr-3"
                          src={funcionario.foto}
                          alt={funcionario.nome}
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {funcionario.nome}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.informacoesFuncionais[0]?.matricula || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.informacoesFuncionais[0]?.setor?.nome || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {funcionario.informacoesFuncionais[0]?.cargo || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        funcionario.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {funcionario.ativo ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDelete(funcionario.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      DELETAR
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 