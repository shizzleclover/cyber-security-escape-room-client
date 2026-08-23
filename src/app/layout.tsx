import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AudioProvider } from '@/features/audio/AudioContext';
import { AccessibilityProvider } from '@/features/accessibility/AccessibilityContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import AccessibilityToolbar from '@/components/layout/AccessibilityToolbar';

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
      <body className={`${jakarta.variable} ${jetbrainsMono.variable} font-sans bg-[#FAF9F5] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white`}>
        <AuthProvider>
          <AudioProvider>
            <AccessibilityProvider>
              <SmoothScroll>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 pt-[72px]">
                  {children}
                </main>
                <Footer />
              </div>
              <AccessibilityToolbar />
              </SmoothScroll>
            </AccessibilityProvider>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
