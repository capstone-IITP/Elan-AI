import './globals.css';
import { ReactNode } from 'react';
import AuthWrapper from './components/AuthWrapper';
import { SmoothScrollProvider } from './context/SmoothScrollProvider';
import PageTransition from './components/PageTransition';
import AnimationInitializer from './components/AnimationInitializer';

export const metadata = {
  title: 'Élan AI - Fashion Stylist & Virtual Try-On',
  description: 'Your personal AI-powered fashion stylist with virtual try-on capabilities.',
  keywords: 'AI, fashion, stylist, virtual try-on, fashion tech, digital wardrobe, Élan AI',
  metadataBase: new URL('https://elan-ai.com'),
  charset: 'utf-8',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <SmoothScrollProvider>
          <AuthWrapper>
            <PageTransition>
              <main className="min-h-screen">
                {children}
              </main>
            </PageTransition>
          </AuthWrapper>
          <AnimationInitializer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
} 