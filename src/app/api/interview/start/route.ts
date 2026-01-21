import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { InterviewSession, Message, StartInterviewRequest, StartInterviewResponse } from '@/types';
import { setSession } from '@/lib/sessionStore';
import { generateInterviewQuestion } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body: StartInterviewRequest = await request.json();
    const { userName } = body;

    if (!userName || userName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Il nome è obbligatorio' },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();
    const now = new Date().toISOString();

    // Create initial message from user introducing themselves
    const initialMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: `Ciao, mi chiamo ${userName.trim()}`,
      timestamp: now,
    };

    // Generate first question from AI
    const aiResponse = await generateInterviewQuestion([initialMessage]);

    const firstQuestion = aiResponse.question || 'Raccontami della tua esperienza nella vendita.';

    // Create assistant message with the question
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: firstQuestion,
      timestamp: new Date().toISOString(),
    };

    // Create session
    const session: InterviewSession = {
      id: sessionId,
      userName: userName.trim(),
      messages: [initialMessage, assistantMessage],
      transcript: [
        {
          timestamp: now,
          type: 'start_interview',
          question: 'Come ti chiami?',
          answer: userName.trim(),
        },
      ],
      createdAt: now,
      isComplete: false,
    };

    setSession(session);

    const response: StartInterviewResponse = {
      sessionId,
      question: firstQuestion,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error starting interview:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
