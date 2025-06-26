'use client';

interface Sistema {
  id: string;
  nome: string;
  descricao?: string;
  nivel: number;
}

interface SistemasGridProps {
  sistemas: Sistema[];
  onSistemaClick: (sistema: Sistema) => void;
}

export default function SistemasGrid({ sistemas, onSistemaClick }: SistemasGridProps) {
  const getNivelText = (nivel: number) => {
    switch (nivel) {
      case 1:
        return 'Usuário Comum';
      case 2:
        return 'Gestor';
      case 3:
        return 'Administrador';
      default:
        return 'Sem acesso';
    }
  };

  const getNivelColor = (nivel: number) => {
    switch (nivel) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSistemaIcon = (nome: string) => {
    if (nome.includes('GP')) return '👥';
    if (nome.includes('Refeitório')) return '🍽️';
    if (nome.includes('CDO')) return '📋';
    if (nome.includes('Almoxarifado')) return '📦';
    if (nome.includes('Ascom')) return '📰';
    return '💻';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistemas Disponíveis
        </h1>
        <p className="text-gray-600">
          Selecione um sistema para acessar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sistemas.map((sistema) => (
          <div
            key={sistema.id}
            onClick={() => onSistemaClick(sistema)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">
                  {getSistemaIcon(sistema.nome)}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNivelColor(sistema.nivel)}`}>
                  {getNivelText(sistema.nivel)}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {sistema.nome}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {sistema.descricao || 'Sistema hospitalar'}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Nível de acesso: {sistema.nivel}
                </span>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Acessar →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sistemas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum sistema disponível
          </h3>
          <p className="text-gray-600">
            Você não tem permissão para acessar nenhum sistema no momento.
          </p>
        </div>
      )}
    </div>
  );
} 