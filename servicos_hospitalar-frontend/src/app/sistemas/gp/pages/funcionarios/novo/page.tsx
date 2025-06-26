"use client";

import NovoFuncionarioForm from '../../../components/NovoFuncionarioForm';
import { useRouter } from 'next/navigation';

export default function NovoFuncionarioPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Novo Funcionário</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <NovoFuncionarioForm
          onClose={() => router.back()}
          onSuccess={() => router.push('/sistemas/gp')}
        />
      </div>
    </div>
  );
} 