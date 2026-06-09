"use client";

import React, { useEffect, useState } from "react";
import ProductSlider from "./ProductSlider";
 
type ButtonType = {
  id: "domestic" | "imported" | "all";
  label: string;
};

export default function FilterProduct() {
  const [activeScope, setActiveScope] = useState<
    "domestic" | "imported" | "all"
  >("all");


const buttons: ButtonType[] = [
  {
    id: "domestic",
    label: "محصولات داخلی",
  },
  {
    id: "imported",
    label: "محصولات وارداتی",
  },
  {
    id: "all",
    label: "همه محصولات",
  },
];
  return (
    <div>
      <div dir="rtl" className="flex w-full justify-center gap-4">
        {buttons.map((button) => (
          <button
          key={button.id}
            className={` border-2 border-pink-200 py-1  px-4  text-[12px] md:text-xl sm:text-base rounded-2xl transition-all ${
              activeScope === `${button.id}`
                ? "bg-pink-500 text-white  font-bold"
                : "text-gray-500 bg-white hover:text-(--color-pink)"
            }`}
            onClick={() => setActiveScope(button.id)}
          >
            {button.label}
          </button>
        ))}
      </div>

      <ProductSlider scope={activeScope}></ProductSlider>
    </div>
  );
}
