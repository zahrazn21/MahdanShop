import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./globals.css";
import ReactQueryProvider from "./providers/react-query-provider";
import BottomNav from "../components/navigation/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa"  suppressHydrationWarning>
      <body className="mx-0 md:max-w-300 md:mx-auto md:px-8 ">
        <ReactQueryProvider>
          {" "}
          <Navbar />
          <Header />
          {children}
          <Footer />
          <BottomNav></BottomNav>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
