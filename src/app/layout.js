import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const apotekCompRegular = localFont({
  src: "../../public/fonts/Apotek_Comp_Regular.otf",
  variable: "--font-apotek-comp-regular",
  display: "swap",
});

export const metadata = {
  title: "SmartB Fantasy - All Competitions",
  description: "Join fantasy sports competitions and win SmartB coins. Play cricket, football, basketball, and more.",
  keywords: "fantasy sports, sports betting, cricket, football, basketball, competitions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${apotekCompRegular.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
