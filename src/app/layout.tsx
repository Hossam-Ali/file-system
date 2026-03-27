import type { Metadata } from 'next';
import { FileSystemProvider } from '@/context/FileSystemContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'React File System',
  description: 'A React file system application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <FileSystemProvider>{children}</FileSystemProvider>
      </body>
    </html>
  );
}
