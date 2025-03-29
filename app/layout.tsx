"use client"
// import Sidebar from "@/components/Sidebar";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
// import { headers } from "next/headers";
// import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import {Montserrat} from "next/font/google"


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Choose the required weights
  variable: "--font-montserrat" // Define a CSS variable
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // const pathname = usePathname()
  // const pathname = headers().get('x-invoke-path') || ''
  // const isLoginPage = pathname === "/login"
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="">
        <NavBar></NavBar>
        <div className="layout-content">
          {/* {!isLoginPage && <Sidebar></Sidebar>} */}
          {children}
        </div>
        <Footer></Footer>
        <Toaster position="top-right"></Toaster>
      </body>
    </html>
  );
}
