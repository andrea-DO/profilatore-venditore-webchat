import { InterviewSession } from '@/types';

// In-memory session store (cleared on server restart)
// For production with persistence, use Redis or database
const sessions = new Map<string, InterviewSession>();

export function getSession(sessionId: string): InterviewSession | undefined {
  return sessions.get(sessionId);
}

export function setSession(session: InterviewSession): void {
  sessions.set(session.id, session);
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export function getAllSessions(): InterviewSession[] {
  return Array.from(sessions.values());
}
