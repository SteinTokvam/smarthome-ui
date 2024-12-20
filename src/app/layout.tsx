import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/lib/apollo-wrapper";

let apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
const userAgent = `SimensSMartHus/1.0.0`;


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

async function fetchWsUrl() {
  try {
      const response = await fetch('https://api.tibber.com/v1-beta/gql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiToken}`,
              'User-Agent': userAgent,
          },
          body: JSON.stringify({
              query: `
                  query GetWssEndpoint {
                      viewer {
                          websocketSubscriptionUrl
                      }
                  }
              `,
          }),
      });
      const result = await response.json();
      return result.data.viewer.websocketSubscriptionUrl;
  } catch (error) {
      throw error;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const wsUrl = await fetchWsUrl();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloWrapper wsUrl={wsUrl}>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
