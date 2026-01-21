import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Intervista di Qualifica Venditori - Gruppo AC Finance',
  description: 'Sistema di intervista automatizzata per la qualifica dei venditori',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
