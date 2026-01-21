import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Message, SendMessageRequest, SendMessageResponse } from '@/types';
import { getSession, setSession } from '@/lib/sessionStore';
import { generateInterviewQuestion } from '@/lib/openai';
import { saveTranscriptToSheets } from '@/lib/sheets';
import { INTERVIEW_CONFIG } from '@/config/interview';

export async function POST(request: NextRequest) {
  try {
    const body: SendMessageRequest = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId e message sono obbligatori' },
        { status: 400 }
      );
    }

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      );
    }

    if (session.isComplete) {
      return NextResponse.json(
        { error: 'Intervista già completata' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Check if user wants to stop
    const lowerMessage = message.toLowerCase().trim();
    const wantsToStop = INTERVIEW_CONFIG.stopKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: now,
    };
    session.messages.push(userMessage);

    if (wantsToStop) {
      // End the interview
      session.isComplete = true;
      session.transcript.push({
        timestamp: now,
        type: 'stop_interview',
        question: null,
        answer: null,
      });

      setSession(session);

      // Save to Google Sheets
      await saveTranscriptToSheets(
        session.id,
        session.userName,
        session.transcript
      );

      const response: SendMessageResponse = {
        question: null,
        isComplete: true,
      };

      return NextResponse.json(response);
    }

    // Generate next question from AI
    const aiResponse = await generateInterviewQuestion(session.messages);

    if (aiResponse.stop_interview || !aiResponse.question) {
      // AI decided to stop
      session.isComplete = true;
      session.transcript.push({
        timestamp: now,
        type: 'stop_interview',
        question: null,
        answer: null,
      });

      setSession(session);

      // Save to Google Sheets
      await saveTranscriptToSheets(
        session.id,
        session.userName,
        session.transcript
      );

      const response: SendMessageResponse = {
        question: null,
        isComplete: true,
      };

      return NextResponse.json(response);
    }

    // Get the last question asked (from previous assistant message)
    const lastAssistantMessage = [...session.messages]
      .reverse()
      .find((m) => m.role === 'assistant');

    // Add to transcript
    session.transcript.push({
      timestamp: now,
      type: 'next_question',
      question: lastAssistantMessage?.content || '',
      answer: message,
    });

    // Add assistant response
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: aiResponse.question,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(assistantMessage);

    setSession(session);

    const response: SendMessageResponse = {
      question: aiResponse.question,
      isComplete: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
