import ThemeRegistry from "@/app/ThemeRegistry";
import Script from "next/script";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <title>Zzirit</title>
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
        <Script
          src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
