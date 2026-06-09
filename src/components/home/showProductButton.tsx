"use client";

export default function ShowProductButton() {
  const handleScroll = () => {
    const el = document.getElementById("products-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button
      onClick={handleScroll}
      className=" sm:text-xl rounded-2xl text-[10px] md:text-xl bg-linear-60  bg-(--color-pink) hover:bg-(--color-pink-dark) text-white font-bold  md:rounded-4xl md:text-[20px] xl:text-[20px] px-3 py-2 sm:px-5 sm:py-3 shadow-md shadow-[#e53b72] transition"
    >
      مشاهده محصولات
    </button>
  );
}
