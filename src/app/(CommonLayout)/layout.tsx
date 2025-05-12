import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/app/ThemeRegistry";
import Header from "@/components/Header";
import Script from "next/script";
import ReactQueryProvider from "@/components/ReactQueryProvider";

export const metadata: Metadata = {
  title: "zzirit",
  description: "zzirit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <ThemeRegistry>
            <Header />
            {children}
          </ThemeRegistry>
        </ReactQueryProvider>
        <Script
          src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
