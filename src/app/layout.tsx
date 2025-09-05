import "./globals.css";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense
          fallback={
            <div
              style={{
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Loading...
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
