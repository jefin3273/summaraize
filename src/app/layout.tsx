import { Inter } from 'next/font/google'
import { NhostClientProvider } from "@/components/nhost-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NhostClientProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster />
        </NhostClientProvider>
      </body>
    </html>
  )
}

