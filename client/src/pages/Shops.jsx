import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { Range } from "react-range";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";
import Products from "../components/products/Products";
import { BsFillGridFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import ShopProducts from "../components/products/ShopProducts";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {
  price_range_product,
  query_products,
} from "../store/reducers/homeReducer";

const Shops = () => {
  const dispatch = useDispatch();
  const {
    products,
    categorys,
    priceRange,
    latest_product,
    totalProduct,
    parPage,
  } = useSelector((state) => state.home);

  // State Hooks
  const [filterVisible, setFilterVisible] = useState(true);
  const [priceRangeState, setPriceRangeState] = useState([
    priceRange.low,
    priceRange.high,
  ]);
  const [rating, setRating] = useState("");
  const [layoutStyle, setLayoutStyle] = useState("grid");
  const [pageNumber, setPageNumber] = useState(1);
  const [sortPrice, setSortPrice] = useState("");
  const [category, setCategory] = useState("");

  // Effects
  useEffect(() => {
    dispatch(price_range_product());
  }, [dispatch]);

  useEffect(() => {
    setPriceRangeState([priceRange.low, priceRange.high]);
  }, [priceRange]);

  useEffect(() => {
    dispatch(
      query_products({
        low: priceRangeState[0],
        high: priceRangeState[1],
        category,
        rating,
        sortPrice,
        pageNumber,
      })
    );
  }, [dispatch, priceRangeState, category, rating, sortPrice, pageNumber]);

  const handleCategoryChange = (e, value) => {
    setCategory(e.target.checked ? value : "");
  };

  const handleResetRating = () => {
    setRating("");
    dispatch(
      query_products({
        low: priceRangeState[0],
        high: priceRangeState[1],
        category,
        rating: "",
        sortPrice,
        pageNumber,
      })
    );
  };

  return (
    <div>
      <Header />
      <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
        <div className="absolute left-0 top-0 w-full h-full bg-[#2422228a]">
          <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
            <div className="flex flex-col justify-center gap-1 items-center h-full w-full text-white">
              <h2 className="text-3xl font-bold">Shop Page</h2>
              <div className="flex justify-center items-center gap-2 text-2xl w-full">
                <Link to="/">Home</Link>
                <span className="pt-1">
                  <IoIosArrowForward />
                </span>
                <span>Shop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto">
          {/* Filter Button */}
          <div
            className={`md:block hidden ${!filterVisible ? "mb-6" : "mb-0"}`}
          >
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="text-center w-full py-2 px-3 bg-indigo-500 text-white"
            >
              Filter Product
            </button>
          </div>

          <div className="w-full flex flex-wrap">
            {/* Filters */}
            <div
              className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${
                filterVisible
                  ? "md:h-0 md:overflow-hidden md:mb-6"
                  : "md:h-auto md:overflow-auto md:mb-0"
              }`}
            >
              <FilterSection
                categorys={categorys}
                category={category}
                onCategoryChange={handleCategoryChange}
              />
              <PriceRangeFilter
                priceRangeState={priceRangeState}
                setPriceRangeState={setPriceRangeState}
              />
              <RatingFilter
                rating={rating}
                setRating={setRating}
                resetRating={handleResetRating}
              />
              <div className="py-5 flex flex-col gap-4 md:hidden">
                <Products title="Latest Product" products={latest_product} />
              </div>
            </div>

            {/* Products and Pagination */}
            <div className="w-9/12 md-lg:w-8/12 md:w-full">
              <ProductListHeader
                totalProduct={totalProduct}
                sortPrice={sortPrice}
                setSortPrice={setSortPrice}
                layoutStyle={layoutStyle}
                setLayoutStyle={setLayoutStyle}
              />
              <div className="pb-8">
                <ShopProducts products={products} styles={layoutStyle} />
              </div>
              {totalProduct > parPage && (
                <Pagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalItem={totalProduct}
                  parPage={parPage}
                  showItem={Math.floor(totalProduct / parPage)}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FilterSection = ({ categorys, category, onCategoryChange }) => (
  <>
    <h2 className="text-3xl font-bold mb-3 text-slate-600">Category</h2>
    <div className="py-2">
      {categorys.map((c) => (
        <div
          key={c.name}
          className="flex justify-start items-center gap-2 py-1"
        >
          <input
            checked={category === c.name}
            onChange={(e) => onCategoryChange(e, c.name)}
            type="checkbox"
            id={c.name}
          />
          <label
            className="text-slate-600 block cursor-pointer"
            htmlFor={c.name}
          >
            {c.name}
          </label>
        </div>
      ))}
    </div>
  </>
);

const PriceRangeFilter = ({ priceRangeState, setPriceRangeState }) => (
  <div className="py-2 flex flex-col gap-5">
    <h2 className="text-3xl font-bold mb-3 text-slate-600">Price</h2>
    <Range
      step={5}
      min={priceRangeState[0]}
      max={priceRangeState[1]}
      values={priceRangeState}
      onChange={setPriceRangeState}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          className="w-full h-[6px] bg-slate-200 rounded-full cursor-pointer"
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          className="w-[15px] h-[15px] bg-[#059473] rounded-full"
          {...props}
        />
      )}
    />
    <div>
      <span className="text-slate-800 font-bold text-lg">
        ${Math.floor(priceRangeState[0])} - ${Math.floor(priceRangeState[1])}
      </span>
    </div>
  </div>
);

const RatingFilter = ({ rating, setRating, resetRating }) => (
  <div className="py-3 flex flex-col gap-4">
    <h2 className="text-3xl font-bold mb-3 text-slate-600">Rating</h2>
    <div className="flex flex-col gap-3">
      {[5, 4, 3, 2, 1].map((r) => (
        <RatingStar key={r} rating={r} onClick={() => setRating(r)} />
      ))}
      <div
        onClick={resetRating}
        className="text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer"
      >
        {[...Array(5)].map((_, i) => (
          <CiStar key={i} />
        ))}
      </div>
    </div>
  </div>
);

const RatingStar = ({ rating, onClick }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (i < rating ? <AiFillStar key={i} /> : <CiStar key={i} />));
  return (
    <div
      onClick={onClick}
      className="text-orange-500 flex justify-start items-start gap-2 text-xl cursor-pointer"
    >
      {stars}
    </div>
  );
};

const ProductListHeader = ({
  totalProduct,
  setSortPrice,
  layoutStyle,
  setLayoutStyle,
}) => (
  <div className="py-4 bg-white mb-10 px-3 rounded-md flex justify-between items-start border">
    <h2 className="text-lg font-medium text-slate-600">
      ({totalProduct}) Products
    </h2>
    <div className="flex justify-center items-center gap-3">
      <select
        onChange={(e) => setSortPrice(e.target.value)}
        className="p-1 border outline-0 text-slate-600 font-semibold"
      >
        <option value="">Sort By</option>
        <option value="low-to-high">Low to High Price</option>
        <option value="high-to-low">High to Low Price</option>
      </select>
      <div className="flex justify-center items-start gap-4 md-lg:hidden">
        <div
          onClick={() => setLayoutStyle("grid")}
          className={`p-2 ${
            layoutStyle === "grid" ? "bg-slate-300" : ""
          } text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
        >
          <BsFillGridFill />
        </div>
        <div
          onClick={() => setLayoutStyle("list")}
          className={`p-2 ${
            layoutStyle === "list" ? "bg-slate-300" : ""
          } text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm`}
        >
          <FaThList />
        </div>
      </div>
    </div>
  </div>
);

export default Shops;
