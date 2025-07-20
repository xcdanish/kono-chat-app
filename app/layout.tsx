import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'QueryDocs AI - Intelligent Document Chat',
  description: 'AI-powered document analysis and chat interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme={undefined}
            enableSystem
            disableTransitionOnChange={false}
          >
            {children}
            <Toaster 
              position="top-right"
              expand={false}
              richColors
              closeButton
            />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}