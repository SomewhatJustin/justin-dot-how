import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Justin Fowler's Website",
    template: "%s - Justin Fowler",
  },
  description: "Personal website of Justin Fowler - software engineer, photographer, writer.",
  openGraph: {
    type: "website",
    siteName: "Justin Fowler",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=atkinson-hyperlegible:400,600,700"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
