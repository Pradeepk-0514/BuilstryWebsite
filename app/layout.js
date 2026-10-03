import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Caveat_Brush } from "next/font/google";

const caveatBrush = Caveat_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat-brush",
  display: "swap",
});

export const metadata = {
  title: "Builstry — Build what should exist",
  description: "Builstry brings strategy, design, technology and innovation together around meaningful problems.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body className={caveatBrush.variable}><Header /><main>{children}</main><Footer /></body></html>;
}
