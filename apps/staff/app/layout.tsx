import type { ReactNode } from "react";

export const metadata = { title: "Alpha-Like School — Staff" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
