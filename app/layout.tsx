import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { getUserRole } from "./actions";
import { Toaster } from 'sonner';
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Footer, FooterBottom } from "@/components/ui/footer";
import { MainNav } from "@/components/main-nav";
// import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import Crausel from "@/components/crausel";
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blood Bank",
  description: "Blood Bank",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="border-b">
          <div className="flex h-20 items-center px-4">
            <MainNav className="md:mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <UserNav isAdmin={userRole[0]} isGuest={userRole[1]} />
            </div>
          </div>
        </div>
        {children}
        <footer className="w-full bg-background px-4">
          <div className="mx-auto max-w-container">
            
            
            
            <Crausel images={
              [
                { src: "/p1.png", alt: "share for good" },
                { src: "/p2.png", alt: "share for good" },
                { src: "/p3.png", alt: "share for good" },
                { src: "/p4.png", alt: "share for good" },
                { src: "/p5.png", alt: "share for good" },
                { src: "/p6.png", alt: "share for good" },
              ]
            } speed={1.5}/>
  
    
            <Footer className="pt-0">
              <FooterBottom className="mt-0 flex flex-col items-center gap-4 sm:flex-col md:flex-row">
                <div>© 2025 Blood Bank Cop. All rights reserved</div>
                <div className="flex items-center gap-4">
                  <div>
                    Designed, Developed, and Maintained by{" "}
                    <a href="https://iamkunal9.github.io/links" target="_blank">iamkunal9</a>
                  </div>
                  <ModeToggle />
                </div>
              </FooterBottom>
            </Footer>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
