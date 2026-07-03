import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AudioProvider } from '@/features/audio/AudioContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'CyberEscape - Interactive Cybersecurity Training',
  description: 'Learn to protect yourself online through interactive escape room challenges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans bg-[#F7F7F8] text-[#111113] antialiased selection:bg-zinc-200`}>
        <AuthProvider>
          <AudioProvider>

            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-[72px]">
                {children}
              </main>
              <Footer />
            </div>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
