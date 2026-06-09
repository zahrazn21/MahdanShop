import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: "url('/images/bglogin.png')",
        backgroundSize: "cover",
        backgroundPosition: "left",
      }}
      className="p-8 min-h-screen content-center  justify-items-end  rounded-4xl border border-[#fdf5f9] shadow shadow-amber-50"
    >
      <div className="w-[50%]">
        <div className="relative tabs w-full flex gap-0.5 items-center justify-between">
          {/* buttons */}
          <Link
            href="/login"
            className="w-full grid py-5 px-3 justify-items-center text-center shadow-[0-2px_2px_#ffa8c6] bg-[#fdf5f9] rounded-t-4xl  text-pink-600 border-2 border-b-transparent border-white font-semibold hover:underline"
          >
            وارد شوید
          </Link>
          <Link
            href="/register"
            className="w-full grid py-5 px-3 justify-items-center text-center shadow-[1px_-2px_2px_#ffa8c6] bg-[#fdf5f9] rounded-t-4xl  text-pink-600 border-2 border-b-transparent border-white font-semibold hover:underline"
          >
            ثبت‌نام
          </Link>
          <Image
            src="/images/papion.png"
            alt="description"
            width={300}
            height={400}
            className="w-30 top-7 left-52 absolute self-center"
          />
        </div>
        <div className="shadow-[0_0_2px_#ffa8c6] pt-1 bg-[#fdf5f9] border-x-2 border-white rounded-b-4xl">
          <div
            dir="rtl"
            className="shadow-[0_0_2px_#ffa8c6] rounded-4xl border-2 border-white   w-full p-8 md:p-10"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
