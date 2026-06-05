// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Missing Character Lab",
  description:
    "A fan-made Pattern Retrieval experiment. Store, corrupt, relax, recall.",
  icons: {
    icon: "/brainerpfp.png",
    shortcut: "/brainerpfp.png",
    apple: "/brainerpfp.png",
  },
  openGraph: {
    title: "The Missing Character Lab",
    description:
      "94 specimens in the archive. 1 unstable visitor outside it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Missing Character Lab",
    description:
      "94 specimens in the archive. 1 unstable visitor outside it.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}