import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';

import Provider from './_trpc/Provider';
import { NotificationProvider } from './_context/NotificationContext';
import { Theme } from '@radix-ui/themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Team-GTP Notifications',
  description: 'Team-GTP interview task',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Theme>
          <Provider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </Provider>
        </Theme>
      </body>
    </html>
  );
}
