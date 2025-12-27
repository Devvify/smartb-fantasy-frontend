import "./globals.css";

export const metadata = {
  title: "SmartB Fantasy - All Competitions",
  description: "Join fantasy sports competitions and win SmartB coins. Play cricket, football, basketball, and more.",
  keywords: "fantasy sports, sports betting, cricket, football, basketball, competitions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
      </body>
    </html>
  );
}
