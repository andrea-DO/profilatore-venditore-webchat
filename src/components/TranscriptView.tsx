'use client';

import { TranscriptEntry } from '@/types';

interface TranscriptViewProps {
  userName: string;
  transcript: TranscriptEntry[];
  onNewInterview: () => void;
}

export default function TranscriptView({
  userName,
  transcript,
  onNewInterview,
}: TranscriptViewProps) {
  const questionAnswers = transcript.filter(
    (entry) => entry.type === 'next_question' || entry.type === 'start_interview'
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Grazie per aver completato l&apos;intervista!
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Ciao {userName}, abbiamo registrato le tue risposte.
        </p>
        <button
          onClick={onNewInterview}
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Inizia nuova intervista
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Trascrizione
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Le risposte sono state salvate in modo sicuro.
        </p>

        <div className="space-y-4">
          {questionAnswers.map((entry, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="text-xs text-gray-400 mb-1">
                {new Date(entry.timestamp).toLocaleString('it-IT', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {entry.question && (
                <div className="bg-gray-100 p-3 rounded-lg mb-2">
                  <p className="text-sm text-gray-700">{entry.question}</p>
                </div>
              )}
              {entry.answer && (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <p className="text-sm text-indigo-900">{entry.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
