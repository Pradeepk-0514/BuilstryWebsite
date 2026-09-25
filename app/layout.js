import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Builstry — Build what should exist",
  description: "Builstry brings strategy, design, technology and innovation together around meaningful problems.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><Header /><main>{children}</main><Footer /></body></html>;
}
