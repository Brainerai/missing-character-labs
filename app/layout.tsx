// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The 95th Specimen Lab",
  description:
    "A fan-made Pattern Retrieval experiment. Store, corrupt, relax, recall.",
  openGraph: {
    title: "The 95th Specimen Lab",
    description:
      "94 specimens in the archive. 1 unstable visitor outside it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 95th Specimen Lab",
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