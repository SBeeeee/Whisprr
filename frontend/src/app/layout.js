import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers} from "@/utils/Providers";
import { Toaster } from "react-hot-toast";


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
        <Toaster position="top-right" />
      </body>
      </Providers>
    </html>
  );
}
