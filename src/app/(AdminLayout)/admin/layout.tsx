import ThemeRegistry from "@/app/ThemeRegistry";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>
          <div>{children}</div>
        </ThemeRegistry>
      </body>
    </html>
  );
}
