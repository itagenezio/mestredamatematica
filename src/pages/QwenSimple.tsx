/**
 * Versão simples pra testar conexão com Qwen
 */

import { useState } from 'react';

export default function QwenSimple() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      console.log('🔄 Testando conexão com NEXUM Router...');
      
      const apiKey = import.meta.env.VITE_NEXUM_API_KEY;
      const apiUrl = import.meta.env.VITE_NEXUM_API_URL;

      console.log('API URL:', apiUrl);
      console.log('API Key presente:', !!apiKey);

      if (!apiKey) {
        throw new Error('VITE_NEXUM_API_KEY não está configurada!');
      }

      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'qwen-3.5-plus',
          messages: [
            { role: 'user', content: 'Olá! Quem é você?' }
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Resposta recebida:', data);
      
      const message = data.choices?.[0]?.message?.content || 'Sem conteúdo';
      setResult(message);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🚀 Teste de Conexão - Qwen 3.5 Plus</h1>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#ccc' : '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {loading ? '⏳ Conectando...' : '🔗 Testar Conexão'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fee', border: '1px solid #f00', borderRadius: '4px' }}>
          <strong>❌ Erro:</strong>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#efe', border: '1px solid #0f0', borderRadius: '4px' }}>
          <strong>✅ Resposta do Qwen:</strong>
          <p>{result}</p>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h3>📋 Variáveis de Ambiente:</h3>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>VITE_NEXUM_API_URL:</td>
              <td style={{ padding: '5px' }}>{import.meta.env.VITE_NEXUM_API_URL || '❌ Não configurada'}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>VITE_NEXUM_API_KEY:</td>
              <td style={{ padding: '5px' }}>{import.meta.env.VITE_NEXUM_API_KEY ? '✅ Configurada' : '❌ Não configurada'}</td>
            </tr>
            <tr>
              <td style={{ padding: '5px', fontWeight: 'bold' }}>VITE_QWEN_MODEL:</td>
              <td style={{ padding: '5px' }}>{import.meta.env.VITE_QWEN_MODEL || 'qwen-3.5-plus'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
