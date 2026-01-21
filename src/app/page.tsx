'use client';

import { useState } from 'react';
import StartForm from '@/components/StartForm';
import ChatWindow from '@/components/ChatWindow';
import TranscriptView from '@/components/TranscriptView';
import { TranscriptEntry } from '@/types';

type View = 'start' | 'chat' | 'complete';

export default function Home() {
  const [view, setView] = useState<View>('start');
  const [sessionId, setSessionId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [initialQuestion, setInitialQuestion] = useState<string>('');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const handleStart = (newSessionId: string, question: string, name: string) => {
    setSessionId(newSessionId);
    setInitialQuestion(question);
    setUserName(name);
    setView('chat');
  };

  const handleComplete = (finalTranscript: TranscriptEntry[]) => {
    setTranscript(finalTranscript);
    setView('complete');
  };

  const handleNewInterview = () => {
    setSessionId('');
    setUserName('');
    setInitialQuestion('');
    setTranscript([]);
    setView('start');
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        {view === 'start' && <StartForm onStart={handleStart} />}

        {view === 'chat' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Ciao <span className="font-medium">{userName}</span>! Rispondi alle domande qui sotto.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Scrivi &quot;stop&quot; o &quot;ferma&quot; per terminare l&apos;intervista
              </p>
            </div>
            <ChatWindow
              sessionId={sessionId}
              initialQuestion={initialQuestion}
              onComplete={handleComplete}
            />
          </div>
        )}

        {view === 'complete' && (
          <TranscriptView
            userName={userName}
            transcript={transcript}
            onNewInterview={handleNewInterview}
          />
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-400">
          <p>Gruppo AC Finance - Sistema di Qualifica Venditori</p>
        </footer>
      </div>
    </main>
  );
}
