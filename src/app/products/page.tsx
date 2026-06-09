import AllProducts from "../../components/product/AllProducts";
import FeaturedProducts from "../../components/product/FeaturedProducts";
import Filters from "../../components/product/Filters";
import ProductSlider from "../../components/product/ProductSlider";
import AllProductsTest from "../test";

export default function page() {
  return (
    <>
    <Filters></Filters>
    <AllProducts scope="all" ></AllProducts>
    <FeaturedProducts></FeaturedProducts>
    <AllProductsTest></AllProductsTest>
    </>
  )
}
