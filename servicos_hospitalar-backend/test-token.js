const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testToken() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWMzaGEzN3kwMDBtdXM5Z3pjbWhmZ21kIiwiY3BmIjoiMDAwMDAwMDAwMDAiLCJub21lIjoiQWRtaW5pc3RyYWRvciBkbyBTaXN0ZW1hIiwicGVybWlzc29lcyI6W3sic2lzdGVtYUlkIjoiY21jM2hhMzQyMDAwNXVzOWdnZ3J6eWx2OCIsInBlcmZpbElkIjoiY21jM2hhMzRmMDAwY3VzOWc5YmR0Y3hteiIsIm5pdmVsIjozfSx7InNpc3RlbWFJZCI6ImNtYzNoYTM0MjAwMDZ1czlnMjFrcDltcjYiLCJwZXJmaWxJZCI6ImNtYzNoYTM0ZjAwMGN1czlnOWJkdGN4bXoiLCJuaXZlbCI6M30seyJzaXN0ZW1hSWQiOiJjbWMzaGEzNDIwMDA3dXM5Z2xlY2NsbmZsIiwicGVyZmlsSWQiOiJjbWMzaGEzNGYwMDBjdXM5ZzliZHRjeG16Iiwibml2ZWwiOjN9LHsic2lzdGVtYUlkIjoiY21jM2hhMzQyMDAwOHVzOWdpeWdwbmdmZyIsInBlcmZpbElkIjoiY21jM2hhMzRmMDAwY3VzOWc5YmR0Y3hteiIsIm5pdmVsIjozfSx7InNpc3RlbWFJZCI6ImNtYzNoYTM0MjAwMDl1czlnand0YjRjZjYiLCJwZXJmaWxJZCI6ImNtYzNoYTM0ZjAwMGN1czlnOWJkdGN4bXoiLCJuaXZlbCI6M31dLCJpYXQiOjE3NTAzNDk5MDksImV4cCI6MTc1MDQzNjMwOX0.icFl3YyOGrzeBCRk3Fw9gKEPPpYOONHjAfnRYzGHdfY';

  try {
    console.log('🔐 Testando token...');
    
    const response = await fetch('http://localhost:3001/permissions', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Erro:', errorData);
    } else {
      const data = await response.json();
      console.log('✅ Sucesso!');
      console.log('Total de permissões:', data.length);
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

testToken(); 