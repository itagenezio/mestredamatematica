/**
 * NEXUM Router Client
 * OpenAI-compatible gateway para acessar Qwen 3.5 Plus
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class NexumRouterClient {
  private apiUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_NEXUM_API_URL || 'https://www.dialagram.me/router/v1';
    this.apiKey = import.meta.env.VITE_NEXUM_API_KEY || '';
    this.model = import.meta.env.VITE_QWEN_MODEL || 'qwen-3.5-plus';

    if (!this.apiKey) {
      console.warn('VITE_NEXUM_API_KEY não configurada em .env.local');
    }
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const payload = {
      model: request.model || this.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 1000,
      top_p: request.top_p ?? 1,
      frequency_penalty: request.frequency_penalty ?? 0,
      presence_penalty: request.presence_penalty ?? 0,
    };

    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `NEXUM Router API error: ${response.status} - ${errorData.error?.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao chamar NEXUM Router:', error);
      throw error;
    }
  }

  async streamChatCompletion(
    request: ChatCompletionRequest,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const payload = {
      model: request.model || this.model,
      messages: request.messages,
      stream: true,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 1000,
    };

    try {
      const response = await fetch(`${this.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`NEXUM Router API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Sem response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const json = JSON.parse(data);
              const chunk = json.choices?.[0]?.delta?.content || '';
              if (chunk) onChunk(chunk);
            } catch {
              // Ignora erros de parse
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro no streaming:', error);
      throw error;
    }
  }
}

export const nexumRouter = new NexumRouterClient();
