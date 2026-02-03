import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AuthKit - Open Source Auth for SaaS",
  description: "The passkeys-first, self-hosted authentication platform for modern SaaS applications. Better than Clerk, open source, and free.",
  openGraph: {
    title: "AuthKit - Open Source Auth for SaaS",
    description: "Multi-tenancy, Passkeys, Audit Logs, and more. Self-hosted and MIT licensed.",
    siteName: "AuthKit",
    images: [{ url: "/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
