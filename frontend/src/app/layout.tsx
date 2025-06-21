import "./globals.css";
import { DM_Sans } from "next/font/google";
import Home from "./page";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="grid bg-[#070815] text-white">
        {/* <Header /> */}
        <main>
          <Home></Home>
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
