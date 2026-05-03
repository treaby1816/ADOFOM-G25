import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Footer from "@/components/ui/Footer";
import "./globals.css";
import "@/utils/console-suppress";
import AuthGuardLayout from "@/components/auth/AuthGuardLayout";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://adofom.vercel.app"),
  title: {
    default: "Ondo State Admin Directory",
    template: "%s | ADOFOM Portal"
  },
  description: "Official staff directory for the Ondo State Administrative Officers Cadre. Browse profiles, contact officers, and celebrate birthdays with professional excellence.",
  keywords: ["Ondo State", "Admin Directory", "Administrative Officers", "ADOFOM", "Civil Service", "Nigeria"],
  authors: [{ name: "Ondo State Government" }],
  creator: "Ondo State Administrative Officers Cadre",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://directory.ondostate.gov.ng",
    title: "Ondo State Administrative Officers Directory",
    description: "The official portal for the Administrative Officers Cadre. Discover, connect, and collaborate with excellence.",
    siteName: "ADOFOM Portal",
    images: [{
      url: "/logo2.jpg",
      width: 800,
      height: 600,
      alt: "Ondo State Administrative Officers Directory Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ondo State Admin Directory",
    description: "Official staff directory for the Ondo State Administrative Officers Cadre.",
    images: ["/logo2.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
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
        <link rel="manifest" href="/manifest.json" />
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
