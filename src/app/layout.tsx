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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark', backgroundColor: 'black' }} suppressHydrationWarning>
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href="apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href="apple-touch-icon-152x152.png" />
      <link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16" />
      <body style={{ backgroundColor: 'black' }} className={`w-full h-dvh ${marsden.variable}`}>
        <div id="chat-container" className="absolute left-0 top-0 h-screen w-full overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
