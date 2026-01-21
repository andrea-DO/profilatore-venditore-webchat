export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface InterviewSession {
  id: string;
  userName: string;
  messages: Message[];
  transcript: TranscriptEntry[];
  createdAt: string;
  isComplete: boolean;
}

export interface TranscriptEntry {
  timestamp: string;
  type: 'start_interview' | 'next_question' | 'stop_interview';
  question: string | null;
  answer: string | null;
}

export interface StartInterviewRequest {
  userName: string;
}

export interface StartInterviewResponse {
  sessionId: string;
  question: string;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
}

export interface SendMessageResponse {
  question: string | null;
  isComplete: boolean;
}

export interface TranscriptResponse {
  sessionId: string;
  userName: string;
  transcript: TranscriptEntry[];
  isComplete: boolean;
}
