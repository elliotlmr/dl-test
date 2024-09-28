import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/utils/AuthProvider';
import FriendsProvider from '@/utils/FriendsProvider';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'DL - Project',
  description: 'Exercise for DogeLabs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={manrope.className}>
      <AuthProvider>
        <FriendsProvider>
          <body>{children}</body>
        </FriendsProvider>
      </AuthProvider>
    </html>
  );
}
