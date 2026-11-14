"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { registerUser } from "@/src/shared/lib/api/auth";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error("Registration error:", error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const password =
        name === "password" ? value : formData.password;

      const confirmPassword =
        name === "confirmPassword"
          ? value
          : formData.confirmPassword;


      if (
        password &&
        confirmPassword &&
        password !== confirmPassword
      ) {
        setPasswordError("رمز عبور با تکرار آن مطابقت ندارد");
      } else {
        setPasswordError("");
      }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("رمز عبور با تکرار آن مطابقت ندارد");
      return;
    }

    mutation.mutate({
      username: formData.name,
      email: formData.email,
      password: formData.password,
    });
  };


  const inputClass =
    `
    w-full
    py-3
    text-sm sm:text-base
    border
    border-white
    rounded-xl
    outline-none
    ring-2
    ring-[#f9d7e5]
    focus:ring-pink-300
    transition-all
    `;


  return (
    <>
      <div className="relative text-center mb-6 sm:mb-8">
        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-pink-800
        ">
          ایجاد حساب کاربری
        </h1>
        <div className="
          border-b-2
          border-dashed
          border-pink-400
          h-4
          w-40
          sm:w-50
          mx-auto
          mb-4
        "/>
        <Image
          src="/images/papillon.png"
          alt="papillon"
          width={300}
          height={400}
          className="
            absolute
            w-8
            sm:w-10
            top-10
            left-1/2
            -translate-x-1/2
            saturate-85
          "
        />
        <p className="
          text-sm
          sm:text-base
          text-pink-500
        ">
          لطفاً اطلاعات خود را وارد کنید
        </p>

      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نام و نام خانوادگی
          </label>
          <div className="relative">
            <User className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-pink-300
            "/>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="علی محمدی"
              className={`${inputClass} pr-12 pl-4`}
            />

          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ایمیل
          </label>
          <div className="relative">
            <Mail className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-pink-300
            "/>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              
              className={`${inputClass} pr-12 pl-4`}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>
          <div className="relative">
            <Lock className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-pink-300
            "/>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              
              className={`${inputClass} pr-12 pl-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تکرار رمز عبور
          </label>
          <div className="relative">
            <Lock className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              w-5
              h-5
              text-pink-300
            "/>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              
              className={`${inputClass} pr-12 pl-12`}
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-pink-300
                hover:text-pink-600
              "
            >

              {
                showConfirmPassword
                ? <EyeOff className="w-5 h-5"/>
                : <Eye className="w-5 h-5"/>
              }

            </button>
          </div>
          {
            passwordError && (
              <p className="text-red-500 text-xs mt-1">
                {passwordError}
              </p>
            )
          }

        </div>
        <button
          type="submit"
          disabled={mutation.isPending || !!passwordError}
          className="
            w-full
            bg-linear-to-r
            from-pink-500
            to-rose-500
            text-white
            py-3
            rounded-xl
            text-sm
            sm:text-base
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            shadow-md
            hover:shadow-lg
            transition-all
            disabled:opacity-50
            disabled:cursor-not-allowed
            mt-5
          "
        >

          {
            mutation.isPending
            ?
            <>
              <div className="
                w-5
                h-5
                border-2
                border-white
                border-t-transparent
                rounded-full
                animate-spin
              "/>

              در حال ثبت‌نام...
            </>
            :
            <>
              <UserPlus className="w-5 h-5"/>
              ثبت‌نام
            </>
          }
        </button>
      </form>
      {
        mutation.error && (
          <div className="
            mt-4
            p-3
            bg-red-50
            border
            border-red-200
            rounded-xl
          ">

            <p className="
              text-red-600
              text-sm
              text-center
            ">
              {(mutation.error as Error).message}
            </p>

          </div>
        )
      }
      <div className="mt-5 sm:mt-6 text-center">
        <p className="text-gray-500 text-sm">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/login"
            className="
              text-pink-600
              font-semibold
              hover:text-pink-800
              transition-all
              duration-300
            "
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </>
  );
}