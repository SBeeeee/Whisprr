import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers} from "@/utils/Providers";


export const metadata = {
  title: "Whispr",
  description: "The Only Productivity App You Need",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
      <body>
        <Navbar/>
        {children}
      
      </body>
      </Providers>
    </html>
  );
}
