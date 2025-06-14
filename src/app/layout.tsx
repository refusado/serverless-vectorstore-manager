import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Roboto as Sans, Roboto_Mono as Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const fontSans = Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const fontMono = Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Serverless Vector Store Manager',
  description: 'Project for managing vector stores completely in client-side.',
};

function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        {children}
        <Toaster
          position="bottom-center"
          theme="dark"
          richColors
          swipeDirections={['right', 'bottom', 'left']}
        />
      </body>
    </html>
  );
}

export default RootLayout;
