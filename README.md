# Profilatore Venditore - Webchat

Sistema di intervista automatizzata per la qualifica dei venditori, alimentato da AI (OpenAI GPT-4o-mini).

## Funzionalità

- **Intervista AI-powered**: Un agente AI conduce interviste di qualifica per venditori
- **Chat in tempo reale**: Interfaccia webchat moderna e responsiva
- **Trascrizione automatica**: Salvataggio delle risposte su Google Sheets
- **Multi-sessione**: Gestione di interviste multiple simultanee

## Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

Copia `.env.example` in `.env.local` e configura:

```bash
cp .env.example .env.local
```

**Variabili richieste:**

| Variabile | Descrizione |
|-----------|-------------|
| `OPENAI_API_KEY` | La tua API key di OpenAI |
| `GOOGLE_CREDENTIALS` | Credenziali Google Service Account (base64) |
| `GOOGLE_SHEET_ID` | ID del Google Sheet per salvare le trascrizioni |

### 3. Configura Google Sheets

1. Crea un progetto su [Google Cloud Console](https://console.cloud.google.com/)
2. Abilita l'API Google Sheets
3. Crea un Service Account e scarica le credenziali JSON
4. Codifica il file JSON in base64:
   ```bash
   base64 -i credentials.json | tr -d '\n'
   ```
5. Incolla il risultato in `GOOGLE_CREDENTIALS`
6. Condividi il Google Sheet con l'email del Service Account

### 4. Avvia l'applicazione

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Deploy su Vercel

1. Fai push del codice su GitHub
2. Importa il progetto su [Vercel](https://vercel.com)
3. Aggiungi le variabili d'ambiente nelle impostazioni del progetto
4. Deploy!

```bash
npm run build
```

## Struttura del Progetto

```
src/
├── app/
│   ├── api/
│   │   └── interview/
│   │       ├── start/          # POST - Inizia intervista
│   │       ├── message/        # POST - Invia messaggio
│   │       └── transcript/     # GET - Ottieni trascrizione
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatWindow.tsx          # Finestra di chat
│   ├── StartForm.tsx           # Form iniziale
│   └── TranscriptView.tsx      # Vista trascrizione
├── config/
│   └── interview.ts            # Configurazione intervista
├── lib/
│   ├── openai.ts               # Client OpenAI
│   ├── sessionStore.ts         # Gestione sessioni
│   └── sheets.ts               # Client Google Sheets
└── types/
    └── index.ts                # TypeScript types
```

## API Endpoints

### POST `/api/interview/start`

Inizia una nuova intervista.

**Request:**
```json
{
  "userName": "Mario Rossi"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "question": "Prima domanda..."
}
```

### POST `/api/interview/message`

Invia una risposta e ottieni la prossima domanda.

**Request:**
```json
{
  "sessionId": "uuid",
  "message": "La mia risposta..."
}
```

**Response:**
```json
{
  "question": "Prossima domanda...",
  "isComplete": false
}
```

### GET `/api/interview/transcript/:sessionId`

Ottieni la trascrizione completa dell'intervista.

**Response:**
```json
{
  "sessionId": "uuid",
  "userName": "Mario Rossi",
  "transcript": [...],
  "isComplete": true
}
```

## Personalizzazione

Modifica `src/config/interview.ts` per personalizzare:

- Topic dell'intervista
- System prompt per l'AI
- Parole chiave per terminare l'intervista
- Titolo e descrizione del form

## License

MIT
