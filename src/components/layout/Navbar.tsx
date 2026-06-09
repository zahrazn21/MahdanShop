import React from "react";
import Menu from "./menu/Menu";
import Image from "next/image";
import SearchBox from "./SearchBox";
import {
  ShoppingBag,
  Heart,

  Handbag,
  UserRound,
} from "lucide-react";
import SearchBoxMobile from "./SearchBoxMobile";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full mb-5 ">
      <nav
        dir="rtl"
        className="md:px-5 place-content-between md:h-20 my-4 relative md:gap-0 flex rounded-3xl  md:mx-4 md:my-10  items-center justify- md:justify-start-safe px-3 py-2 md:bg-(--color-pink-light) md:shadow-[3px_2px_29px_rgba(207,68,119,72%)] "
      >
        <div className="md:w-20 hidden md:block"></div>
        <div className="hidden  md:block xl:block absolute -right-2 top-1 -translate-y-1/4 drop-shadow-[2px_2px_6px_rgba(190,64,126,59%)]">
          <Image
            src="/images/logo2.png"
            alt="description"
            width={400}
            height={400}
            className="md:w-47 "
          />
        </div>
        <div className="hidden md:block">
          <SearchBox></SearchBox>
        </div>
  
        <Menu></Menu>
        <Image
          src="/images/logomobile2.png"
          alt="description"
          width={300}
          height={400}
          className="w-40  md:w-52  md:hidden xl:hidden"
        />
        <div className="text-pink-600 flex md:hidden gap-5">
          <Heart className="w-7 h-7" />
          <Link href={"/cart"}>
            <ShoppingBag className="w-7 h-7" />
          </Link>
        </div>
        <div
          dir="ltr"
          className="hidden text-pink-800 gap-4 md:flex items-center place-content-between "
        >
          <Link href={"/cart"}>
            <Handbag className="w-7 h-7 hover:text-pink-500" />
          </Link>
          <div className="border-r-2 border-r-[#f8e3ef] h-9 w-0"></div>
          <Link href={"/faiverite"}>
            <Heart className="w-7 h-7 hover:text-pink-500" />
          </Link>
          <div className="border-r-2 border-r-[#f8e3ef] h-9 w-0"></div>
          <Link href={"/login"}>
            <UserRound className="w-7 h-7 hover:text-pink-500" />
          </Link>
        </div>
      </nav>
      <div className="md:hidden px-5">
        <SearchBoxMobile></SearchBoxMobile>
      </div>
    </div>
  );
}
