export default function SimpleTest() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'blue', fontSize: '24px' }}>Teste Simples</h1>
      <p>Se você vê este texto, o React está funcionando.</p>
      
      <div className="bg-red-500 text-white p-4 m-4 rounded">
        <p>Se você vê este fundo vermelho, o Tailwind está funcionando!</p>
      </div>
      
      <div className="bg-blue-500 text-white p-4 m-4 rounded">
        <p>Se você vê este fundo azul, o Tailwind está funcionando!</p>
      </div>
      
      <div className="bg-green-500 text-white p-4 m-4 rounded">
        <p>Se você vê este fundo verde, o Tailwind está funcionando!</p>
      </div>
    </div>
  );
} 