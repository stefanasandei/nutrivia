import "@/styles/globals.css";
import { type Viewport, type Metadata } from "next";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getServerAuthSession } from "@/server/auth";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { env } from "@/env";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import Footer from "@/components/footer";
import RewardProvider from "@/components/reward-provider";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icons/favicon.ico",
    shortcut: "/icons/favicon-16x16.png",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "manifest.json",
  applicationName: siteConfig.name,
};

export const viewport: Viewport = {
  themeColor: "#00ffa6",
};

export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerAuthSession();
  const user = await api.user.get.query();

  let points = 0;
  if (user != null)
    points = await api.challenge.getUserPoints.query({
      userId: user.id,
    });

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
        </head>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader
                session={session}
                userMetadata={user}
                userPoints={points}
                isAdmin={session?.user.id === env.ADMIN_ID}
              />
              <TRPCReactProvider>
                <div className="flex h-full flex-1 flex-col">{children}</div>
                <RewardProvider />
              </TRPCReactProvider>
              <Footer />
              <Toaster
                toastOptions={{
                  style: { willChange: "unset" },
                }}
              />
            </div>
            {/* <TailwindIndicator /> */}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
