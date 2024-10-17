import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"
import localFont from "next/font/local"
import Link from "next/link"
import "./globals.css"
import { Providers } from "./providers"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-fit min-h-screen flex`}
      >
        <Providers>
          <Navbar isBlurred>
            <NavbarBrand>
              <h2 className="font-bold text-xl">Lioness</h2>
            </NavbarBrand>
            <NavbarContent justify="end">
              <NavbarItem>
                <Link href="/rules">Rules</Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/uploads">Uploads</Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/logs">Logs</Link>
              </NavbarItem>
              <NavbarItem>
                <Link href="/settings">Settings</Link>
              </NavbarItem>
            </NavbarContent>
          </Navbar>

          <div className="px-8 w-full container mx-auto">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
