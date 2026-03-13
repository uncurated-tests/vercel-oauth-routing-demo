import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vercel OAuth Routing Demo',
  description:
    'Create routing rules on your Vercel project using Sign in with Vercel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white antialiased">
        {children}
      </body>
    </html>
  )
}
