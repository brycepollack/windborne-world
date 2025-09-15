import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WindBorne World',
  description: 'WindBorne World',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
