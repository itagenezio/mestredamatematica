/**
 * Página de teste para Qwen 3.5 Plus
 */

import { useState, useRef, useEffect } from 'react';
import { useQwen } from '@/hooks/useQwen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function QwenTestPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [useStream, setUseStream] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loading, error, sendMessage, streamMessage } = useQwen({
    temperature: 0.7,
    maxTokens: 2000,
  });

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    // Adiciona mensagem do usuário
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Prepara contexto para a API
    const messagesForApi = [
      {
        role: 'system' as const,
        content: 'Você é um assistente útil de matemática. Responda em português.',
      },
      ...messages,
      userMessage,
    ];

    if (useStream) {
      // Usa streaming
      let fullResponse = '';
      const tempMessages = [
        ...messages,
        userMessage,
        { role: 'assistant' as const, content: '' },
      ];
      setMessages(tempMessages);

      try {
        await streamMessage(messagesForApi, (chunk) => {
          fullResponse += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: fullResponse,
            };
            return updated;
          });
        });
      } catch (err) {
        console.error('Erro no streaming:', err);
      }
    } else {
      // Usa resposta completa
      try {
        const response = await sendMessage(messagesForApi);
        if (response) {
          const assistantMessage = {
            role: 'assistant' as const,
            content: response.choices[0].message.content,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (err) {
        console.error('Erro ao enviar:', err);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen flex-col gap-4 p-4 bg-background">
      <Card>
        <CardHeader>
          <CardTitle>Qwen 3.5 Plus - Teste</CardTitle>
          <CardDescription>
            Chat com Qwen via NEXUM Router
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto mb-4 border rounded-md p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Envie uma mensagem para começar...
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-black rounded-bl-none'
                  }`}
                >
                  <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-black px-4 py-2 rounded-lg">
                  <p className="animate-pulse">Qwen está pensando...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              variant="default"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={useStream}
                onChange={(e) => setUseStream(e.target.checked)}
                disabled={loading}
              />
              Usar streaming
            </label>
            <Button
              onClick={handleClearChat}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Limpar chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
