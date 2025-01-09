import type { Metadata, Viewport } from "next";
import "./globals.css";

import localFont from 'next/font/local';

// Font files can be colocated inside of `app`
const marsden = localFont({
  variable: '--font-marsden',
  src: [
    {
      path: './fonts/Marsden-Nr-Regular.ttf',
      weight: '400',
      style: 'normal',
    }
  ]
})

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content'
}

export const metadata: Metadata = {

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-dvh dark" style={{ colorScheme: 'dark', backgroundColor: 'pink' }} suppressHydrationWarning>
      <meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no' />
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href="apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href="apple-touch-icon-152x152.png" />
      <link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16" />
      <body style={{ backgroundColor: 'black' }} className={`w-full ${marsden.variable}`}>
        <div id="chat-container" className="max-w-lg mx-auto relative h-dvh overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
