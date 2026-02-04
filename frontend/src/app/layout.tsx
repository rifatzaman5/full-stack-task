import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Billing System',
  description: 'Track time and manage project billing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
