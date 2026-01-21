import OpenAI from 'openai';
import { Message } from '@/types';
import { INTERVIEW_CONFIG } from '@/config/interview';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

interface AIResponse {
  stop_interview: boolean;
  question: string | null;
}

export async function generateInterviewQuestion(
  messages: Message[]
): Promise<AIResponse> {
  const openai = getOpenAIClient();
  
  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: INTERVIEW_CONFIG.systemPrompt },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: chatMessages,
    temperature: 0.7,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content || '';
  
  try {
    // Parse JSON response, handling potential markdown code blocks
    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanedContent) as AIResponse;
    return parsed;
  } catch (error) {
    console.error('Failed to parse AI response:', content, error);
    // Return a safe default
    return {
      stop_interview: false,
      question: 'Mi scusi, potrebbe ripetere la sua risposta?',
    };
  }
}
