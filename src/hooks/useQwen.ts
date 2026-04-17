/**
 * Hook customizado para usar Qwen 3.5 Plus via NEXUM Router
 */

import { useState, useCallback } from 'react';
import { nexumRouter, ChatMessage, ChatCompletionResponse } from '@/integrations/nexum-router';

interface UseQwenOptions {
  temperature?: number;
  maxTokens?: number;
}

export function useQwen(options: UseQwenOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ChatCompletionResponse | null>(null);

  const sendMessage = useCallback(
    async (messages: ChatMessage[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await nexumRouter.createChatCompletion({
          model: 'qwen-3.5-plus',
          messages,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
        });

        setResponse(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Erro ao chamar Qwen:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const streamMessage = useCallback(
    async (messages: ChatMessage[], onChunk: (chunk: string) => void) => {
      setLoading(true);
      setError(null);

      try {
        await nexumRouter.streamChatCompletion(
          {
            model: 'qwen-3.5-plus',
            messages,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
          },
          onChunk
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error('Erro no streaming:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    loading,
    error,
    response,
    sendMessage,
    streamMessage,
  };
}
