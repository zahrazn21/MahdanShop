"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { loginUser } from "@/src/shared/lib/api/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          خوش آمدید
        </h1>

        <p className="text-sm sm:text-base text-gray-500">
          برای ورود اطلاعات خود را وارد کنید
        </p>
      </div>


      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>

          <div className="relative">
            <Mail
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-5 h-5
                text-pink-300
                drop-shadow-[0_2px_1px_#ff9ecef0]
              "
            />

            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="
                w-full
                pr-12 pl-4
                py-3
                text-sm sm:text-base
                border outline-2
                outline-[#f9d7e5]
                border-white
                rounded-xl
                focus:outline-none
                focus:border-pink-400
                focus:ring-2
                focus:ring-pink-100
                transition-all
              "
            />
          </div>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>

          <div className="relative">

            <Lock
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-5 h-5
                text-pink-300
              "
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="
                w-full
                pr-12 pl-12
                py-3
                text-sm sm:text-base
                border outline-2
                outline-[#f9d7e5]
                border-white
                rounded-xl
                focus:outline-none
                focus:border-pink-400
                focus:ring-2
                focus:ring-pink-100
                transition-all
              "
            />


            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-pink-300
                hover:text-pink-600
              "
            >
              {
                showPassword
                  ? <EyeOff className="w-5 h-5"/>
                  : <Eye className="w-5 h-5"/>
              }
            </button>

          </div>
        </div>


        <div className="text-start">
          <Link
            href="/forgot-password"
            className="
              text-sm
              text-pink-600
              hover:underline
            "
          >
            رمز عبور خود را فراموش کرده‌اید؟
          </Link>
        </div>


        <button
          type="submit"
          disabled={mutation.isPending}
          className="
            w-full
            bg-linear-to-r
            from-pink-500
            to-rose-500
            text-white
            py-3
            rounded-xl
            text-sm sm:text-base
            font-semibold
            hover:from-pink-600
            hover:to-rose-600
            transition-all
            flex
            items-center
            justify-center
            gap-2
            shadow-md
            disabled:opacity-50
          "
        >

          {mutation.isPending ? (
            <>
              <div className="
                w-5 h-5
                border-2
                border-white
                border-t-transparent
                rounded-full
                animate-spin
              "/>

              در حال ورود...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5"/>
              ورود
            </>
          )}

        </button>

      </form>


      {mutation.error && (
        <div className="
          mt-4
          p-3
          bg-red-50
          border
          border-red-200
          rounded-xl
        ">
          <p className="text-red-600 text-sm text-center">
            {(mutation.error as Error).message}
          </p>
        </div>
      )}


      <div className="mt-5 sm:mt-6 text-center">
        <p className="text-gray-500 text-sm">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="
              text-pink-600
              font-semibold
              hover:underline
            "
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </>
  );
}