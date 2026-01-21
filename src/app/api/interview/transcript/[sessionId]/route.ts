import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessionStore';
import { TranscriptResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Sessione non trovata' },
        { status: 404 }
      );
    }

    const response: TranscriptResponse = {
      sessionId: session.id,
      userName: session.userName,
      transcript: session.transcript,
      isComplete: session.isComplete,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
