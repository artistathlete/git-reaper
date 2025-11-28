import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Git Reaper',
  description: 'Visualize dead branches in your GitHub repositories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
