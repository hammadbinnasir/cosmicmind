import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CosmicMind - AI-Powered Galaxy Exploration & Deep Space Intelligence',
  description: 'NASA-inspired space exploration, multi-band galaxy ingestion, astrophysics assistant Q&A, and real-time transient monitors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased text-slate-300 bg-[#050508] selection:bg-cyan-500/20 selection:text-cyan-400" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
