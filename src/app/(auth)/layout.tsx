import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen p-4 sm:p-8
        flex items-center justify-center lg:justify-end
        rounded-4xl border border-[#fdf5f9]
        shadow shadow-amber-50
        bg-none
        md:bg-[url('/images/bglogin.png')]
        md:bg-cover
        md:bg-center   
      "
    >
      <div
        className="
          w-full 
          sm:w-[80%]
          md:w-[60%]
          lg:w-[50%]
          max-w-xl
        "
      >
        <div
          dir="rtl"
          className="relative tabs w-full flex gap-1 items-center justify-between"
        >
          <Link
            href="/login"
            className="
              w-full grid py-4 sm:py-5 px-2 sm:px-3
              justify-items-center text-center
              shadow-[0_-2px_2px_#ffa8c6]
              bg-[#fdf5f9]
              rounded-t-4xl
              text-pink-600
              border-2 border-b-transparent border-white
              font-semibold 
              text-sm sm:text-base
            "
          >
            <div
              className="
               transition-all
               duration-400
               hover:drop-shadow-[4px_4px_6px_rgba(190,64,126,59%)]
               "
            >
              وارد شوید
            </div>
          </Link>

          <Link
            href="/register"
            className="
              w-full grid py-4 sm:py-5 px-2 sm:px-3
              justify-items-center text-center
              shadow-[1px_-2px_2px_#ffa8c6]
              bg-[#fdf5f9]
              rounded-t-4xl
              text-pink-600
              border-2 border-b-transparent border-white
              font-semibold
              text-sm sm:text-base
            "
          >
              <div
              className="
               transition-all
               duration-400
               hover:drop-shadow-[4px_4px_6px_rgba(190,64,126,59%)]
               "
            >
            ثبت‌نام

            </div>
          </Link>

          <Image
            src="/images/papillon.png"
            alt="description"
            width={300}
            height={400}
            className="
              absolute
              w-16 sm:w-24 md:w-30
              top-5 sm:top-7
              left-1/2
              -translate-x-1/2
            "
          />
        </div>

        <div
          className="
            shadow-[0_0_2px_#ffa8c6]
            pt-1 bg-[#fdf5f9]
            border-x-2 border-white
            rounded-b-4xl
          "
        >
          <div
            dir="rtl"
            className="
              shadow-[0_0_2px_#ffa8c6]
              rounded-4xl
              border-2 border-white
              w-full
              p-5 sm:p-8 md:p-10
            "
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
