import Image from "next/image";
import BannerSlider from "./BannerSlider";
import ShowProductButton from "./showProductButton";
import BannerMobile from "./BannerMobile";

export default function Banner() {
  return (
    <>
      <div className="hidden md:flex bg-(--color-pink-light) md:bg-transparent p-5 rounded-2xl justify-around items-start ">
        <div className="w flex flex-col items-center justify-center gap-2 text-center md:my-10">
          <div className="relative">
            <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-10   border-dashed  ">
              <Image
                src="/images/love.png"
                alt="test"
                width={60}
                height={60}
                className="w-10 md:w-20 lg:w-24 h-auto"
              />
              <div className="grid ">
                <p className="border-b-4 pb-4 mb-5 border-[#fddae6] text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-pink-600 whitespace-nowrap">
                  همیشه خاص باش
                </p>
                <p className="text-base font-bold text-[#765864] whitespace-nowrap">
                  محصولات کیوت و خاص برای دنیای قشنگ تو
                </p>
              </div>
              <Image
                src="/images/love.png"
                alt="test"
                width={60}
                height={60}
                className="w-10 md:w-20 lg:w-24 h-auto"
              />
            </div>
            {/* <div
            className="absolute bottom-0 left-0 w-full h-0.5 
        bg-[linear-gradient(to_right,var(--color-pink-white)_50%,transparent_50%)] 
        bg-size-[10px_2px]"
          /> */}
          </div>
          <ShowProductButton />
        </div>
        {/* <Image
        src="/images/banner.png"
        alt="test"
        width={500}
        height={300}
      />{" "} */}
        <div className="w-full md:w-150 max-w-full overflow-hidden">
          <BannerSlider />
        </div>
      </div>

      <div className="md:hidden   w-full  ">
        <BannerMobile></BannerMobile>
      </div>
    </>
  );
}
