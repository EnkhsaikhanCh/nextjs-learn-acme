import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ApolloWrapper from "./api/graphql/ApolloWrappre";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster richColors position="top-center" />
        <SessionProviderWrapper>
          <ApolloWrapper>{children}</ApolloWrapper>
        </SessionProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
