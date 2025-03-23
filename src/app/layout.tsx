import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ApolloWrapper from "./api/graphql/ApolloWrappre";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Geist Sans-г ашиглах
const geistSans = GeistSans;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <SessionProviderWrapper>
          <ApolloWrapper>{children}</ApolloWrapper>
        </SessionProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
