export default function DebugPage() {
  return (
    <div>
      <h1>Página de Debug</h1>
      
      {/* Teste com CSS inline */}
      <div style={{ 
        backgroundColor: 'red', 
        color: 'white', 
        padding: '20px', 
        margin: '10px',
        borderRadius: '8px'
      }}>
        <p>Teste com CSS inline - Fundo vermelho</p>
      </div>
      
      {/* Teste com Tailwind */}
      <div className="bg-blue-500 text-white p-5 m-2 rounded">
        <p>Teste com Tailwind - Fundo azul</p>
      </div>
      
      {/* Teste com Tailwind - cores básicas */}
      <div className="bg-green-500 text-white p-5 m-2 rounded">
        <p>Teste com Tailwind - Fundo verde</p>
      </div>
      
      {/* Teste com Tailwind - flexbox */}
      <div className="flex space-x-4 p-4">
        <div className="bg-yellow-500 text-black p-3 rounded">Item 1</div>
        <div className="bg-purple-500 text-white p-3 rounded">Item 2</div>
        <div className="bg-pink-500 text-white p-3 rounded">Item 3</div>
      </div>
      
      {/* Teste com Tailwind - grid */}
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-gray-500 text-white p-3 rounded">Grid 1</div>
        <div className="bg-gray-600 text-white p-3 rounded">Grid 2</div>
        <div className="bg-gray-700 text-white p-3 rounded">Grid 3</div>
      </div>
    </div>
  );
} 