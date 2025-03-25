"use client"
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
// import { headers } from "next/headers";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()
  // const pathname = headers().get('x-invoke-path') || ''
  const isLoginPage = pathname === "/login"
  return (
    <html lang="en">
      <body className="">
        <NavBar></NavBar>
        <div className="layout-content">
          {!isLoginPage && <Sidebar></Sidebar>}
          {children}
        </div>
        <Footer></Footer>
      </body>
    </html>
  );
}
