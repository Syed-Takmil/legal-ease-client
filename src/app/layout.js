import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/shared/NavBar";
import Footer from "@/Components/shared/Footer";
import { Providers } from "./providers";
import ThemeToggle from "@/Components/shared/ThemeToggle";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Home - LegalEase",
  description: "Online Lawyer Hiring Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
       suppressHydrationWarning={true} 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
        <Navbar/>
       <main className="flex-1">
         {children}
         </main>
        <Footer/>
        <ThemeToggle/>
      </Providers>
      <ToastContainer/>
        </body>
    </html>
  );
}
