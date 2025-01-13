import { Inter } from "next/font/google";
import { NhostProvider, NhostClient } from "@nhost/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || "",
  region: process.env.NEXT_PUBLIC_NHOST_REGION || "",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NhostProvider nhost={nhost}>
          {children}
          <Toaster />
        </NhostProvider>
      </body>
    </html>
  );
}
