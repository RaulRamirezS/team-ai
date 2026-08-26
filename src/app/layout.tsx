import type { Metadata } from "next";
import { Anybody } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEAM International | Custom Software Develop",
  description:
    "Driving your business growth with exceptional speed and exceptional quality, at competitive pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anybody.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
