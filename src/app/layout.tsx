import type { Metadata } from "next";
import { Geist, Geist_Mono, Kantumruy_Pro } from "next/font/google";
import "@/app/style/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kantumruy = Kantumruy_Pro({
  variable: "--font-main",
  subsets: ["latin", "khmer"],
  weight: ["300", "400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const KEY='theme'; const saved = localStorage.getItem(KEY); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; const mode = saved || (prefersDark ? 'dark' : 'light'); const html = document.documentElement; if (mode === 'dark') { html.setAttribute('data-theme','dark'); html.classList.add('dark'); } else { html.removeAttribute('data-theme'); html.classList.remove('dark'); } } catch(_) {} })();`,
          }}
        />
      </head>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${kantumruy.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
