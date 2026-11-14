import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./globals.css";
import ReactQueryProvider from "./providers/react-query-provider";
import BottomNav from "../components/navigation/BottomNav";
import { ToastProvider } from "../shared/contexts/ToastContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body>
        <div className="flex justify-between bg-pink-900 px-6 py-1.5 text-xs text-white">
          <span>تخفیف‌های ویژه | اصالت کالا | پشتیبانی ۲۴ ساعته</span>
          <span>ارسال رایگان برای سفارش‌های بالای ۸۰۰ هزار تومان</span>
        </div>
        <div className="md:mx-auto max-w-6xl space-y-14 px-4 py-4">
          <ToastProvider>
            <ReactQueryProvider>
              {" "}
              <Navbar />
              <Header />
              {children}
              <Footer />
            </ReactQueryProvider>
          </ToastProvider>
          <Toaster position="top-center" richColors />
        </div>
        <BottomNav />
      </body>
    </html>
  );
}