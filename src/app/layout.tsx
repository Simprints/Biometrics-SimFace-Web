import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SimFace Demo",
  description: "Demonstration of the SimFace algorithm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
