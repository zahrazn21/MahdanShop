import AllProducts from "../../components/product/AllProducts";
import Filters from "../../components/product/Filters";

export default function Page() {
  return (
    <>
      <div
        dir="rtl"
        className="
          md:mx-auto
          w-full
          md:max-w-400
          px-2
          md:px-4
          sm:px-2
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-[300px_minmax(0,1fr)]
            lg:items-start
            xl:grid-cols-[260px_minmax(0,1fr)]
          "
        >

          <aside className="w-full">
            <Filters />
          </aside>


          <main className="min-w-0  lg:sticky lg:top-5">
            <AllProducts scope="all" />
          </main>
        </div>
      </div>

      {/* <FeaturedProducts /> */}
      {/* <AllProductsTest /> */}
    </>
  );
}
