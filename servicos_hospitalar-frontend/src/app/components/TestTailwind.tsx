export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">
          Teste do Tailwind CSS
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-blue-800">
              Se você consegue ver este texto em azul com fundo azul claro, o Tailwind está funcionando!
            </p>
          </div>
          
          <div className="bg-green-100 p-4 rounded">
            <p className="text-green-800">
              Este é um teste com verde para confirmar que as cores estão funcionando.
            </p>
          </div>
          
          <div className="bg-red-100 p-4 rounded">
            <p className="text-red-800">
              E este é um teste com vermelho.
            </p>
          </div>
          
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Botão de Teste
          </button>
        </div>
      </div>
    </div>
  );
} 