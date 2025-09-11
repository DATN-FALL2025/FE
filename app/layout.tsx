import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { siteConfig } from "@/config/site";
import { fontMono, fontSans } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// import SessionProviders from "@/providers/session-provider";
// import { ModalProvider } from "@/providers/modal-provider";
// import { QueryProvider } from "@/providers/query-provider";

import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["nextjs",],
  authors: [
    {
      name: "huynhtuong477",
      url: "huynhtuong477@gmail.com",
    },
  ],
  creator: "huynhtuong477",

};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
       <NextTopLoader height={5} color="#E87931"/>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <SessionProviders>
            <QueryProvider>
              <ModalProvider /> */}
              {children}
              <Toaster />
            {/* </QueryProvider>
          </SessionProviders> */}
        </ThemeProvider>
      </body>
    </html>
  );
}


