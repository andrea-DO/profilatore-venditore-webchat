'use client';

import { useState } from 'react';

interface StartFormProps {
  onStart: (sessionId: string, question: string, userName: string) => void;
}

export default function StartForm({ onStart }: StartFormProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Per favore inserisci il tuo nome');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        onStart(data.sessionId, data.question, name.trim());
      } else {
        setError(data.error || 'Si è verificato un errore');
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      setError('Errore di connessione. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Intervista di Qualifica Venditori
        </h1>
        <p className="text-sm text-gray-600">Gruppo AC Finance</p>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Grazie per partecipare alla nostra intervista. Ti presenteremo una serie
        di domande mirate per valutare la tua esperienza e il tuo approccio alla
        vendita: motivazione e mindset, disciplina e metodo, stabilità
        personale, coerenza del percorso, autoanalisi e crescita, ambizione e
        visione, gestione della pressione e atteggiamento commerciale.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Come ti chiami?
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="es. Mario Rossi"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Caricamento...' : 'Inizia intervista!'}
        </button>
      </form>
    </div>
  );
}
