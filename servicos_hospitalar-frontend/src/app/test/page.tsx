export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Teste do Tailwind CSS
        </h1>
        <p className="text-gray-700 mb-4">
          Se você consegue ver este texto estilizado, o Tailwind está funcionando!
        </p>
        <div className="space-y-2">
          <div className="bg-red-100 p-3 rounded text-red-800">
            Teste com vermelho
          </div>
          <div className="bg-green-100 p-3 rounded text-green-800">
            Teste com verde
          </div>
          <div className="bg-yellow-100 p-3 rounded text-yellow-800">
            Teste com amarelo
          </div>
        </div>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Botão de Teste
        </button>
      </div>
    </div>
  );
} 