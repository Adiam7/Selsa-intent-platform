import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Intent Platform',
  description: 'Real-time user intent analytics and personalization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
