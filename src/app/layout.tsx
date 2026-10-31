import { Roboto } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable} antialiased`}>
        <main className="min-h-screen w-full">
          {children}
          <Toaster position="top-right" />
        </main>
      </body>
    </html>
  );
}
