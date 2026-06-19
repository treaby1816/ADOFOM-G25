import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Footer from "@/components/ui/Footer";
import "./globals.css";
import "@/utils/console-suppress";
import AuthGuardLayout from "@/components/auth/AuthGuardLayout";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.adofom.com.ng"),
  title: {
    default: "ADOFOM E-Platform",
    template: "%s | ADOFOM"
  },
  description: "Secure digital platform for the Administrative Officers' Forum, Ondo State. An independent initiative by Treabyn Inc. supporting cadre communication and directory access.",
  keywords: ["ADOFOM", "Ondo State", "Administrative Officers", "Cadre Directory", "Civil Service", "Nigeria", "Treabyn"],
  authors: [{ name: "Treabyn Inc.", url: "https://my-portfolio-v1-c1lt.vercel.app/" }],
  creator: "Treabyn Inc.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://www.adofom.com.ng",
    title: "ADOFOM E-Platform",
    description: "Secure platform for the Administrative Officers\' Forum, Ondo State. An independent initiative by Treabyn Inc.",
    siteName: "ADOFOM E-Platform",
    images: [{
      url: "/logo2.jpg",
      width: 800,
      height: 600,
      alt: "ADOFOM E-Platform Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADOFOM E-Platform",
    description: "Secure cadre directory and communication platform for Ondo State Administrative Officers. Independent initiative by Treabyn Inc.",
    images: ["/logo2.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body 
        className="antialiased min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300 selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <AuthGuardLayout>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
          </AuthGuardLayout>
        </ThemeProvider>
        <Toaster richColors position="top-center" theme="dark" />
        <Analytics />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
