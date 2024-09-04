import React, { useEffect, useState } from "react";
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "../../store/Reducers/categoryReducer";
import { add_product, messageClear } from "../../store/Reducers/productReducer";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import toast from "react-hot-toast";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category);
  const { userInfo } = useSelector((state) => state.auth);
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, [dispatch]);

  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const [image, setImage] = useState(null);
  const [imageShow, setImageShow] = useState("");

  const imageHandle = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageShow(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setImageShow("");
      setImage(null);
      setCategory("");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const removeImage = () => {
    setImage(null);
    setImageShow("");
  };

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("discount", state.discount);
    formData.append("brand", state.brand);
    formData.append("shopName", userInfo.name);
    formData.append("category", category);
    if (image) {
      formData.append("images", image);
    }
    dispatch(add_product(formData));
  };

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-6 bg-[#648DE5] rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-5">
          Add New Product
        </h2>
        <form onSubmit={add}>
          <div className="flex flex-col mb-4 md:flex-row gap-4 w-full text-white">
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="name" className="text-lg">
                Product Name
              </label>
              <input
                className="px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.name}
                type="text"
                name="name"
                id="name"
                placeholder="Product Name"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label htmlFor="brand" className="text-lg">
                Product Brand
              </label>
              <input
                className="px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.brand}
                type="text"
                name="brand"
                id="brand"
                placeholder="Brand Name"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4 md:flex-row gap-4 w-full text-white">
            <div className="flex flex-col w-full gap-2 relative">
              <label htmlFor="category" className="text-lg">
                Category
              </label>
              <input
                readOnly
                onClick={() => setCateShow(!cateShow)}
                className="px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                value={category}
                type="text"
                id="category"
                placeholder="-- Select Category --"
              />

              <div
                className={`absolute top-[100%] left-0 bg-[#475569] w-full transition-transform duration-300 transform ${
                  cateShow ? "scale-100" : "scale-0"
                }`}
              >
                <div className="w-full p-3">
                  <input
                    value={searchValue}
                    onChange={categorySearch}
                    className="px-3 py-1 w-full focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                    type="text"
                    placeholder="Search"
                  />
                </div>
                <div className="flex flex-col h-48 overflow-y-auto">
                  {allCategory.map((c, i) => (
                    <span
                      key={i}
                      className={`px-4 py-2 hover:bg-[#304C89] hover:text-white cursor-pointer ${
                        category === c.name ? "bg-[#304C89]" : ""
                      }`}
                      onClick={() => {
                        setCateShow(false);
                        setCategory(c.name);
                        setSearchValue("");
                        setAllCategory(categorys);
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col w-full gap-2">
              <label htmlFor="stock" className="text-lg">
                Product Stock
              </label>
              <input
                className="px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.stock}
                type="text"
                name="stock"
                id="stock"
                placeholder="Stock"
              />
            </div>
          </div>

          <div className="flex flex-col mb-4 md:flex-row gap-4 w-full text-white">
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="price" className="text-lg">
                Price
              </label>
              <input
                className="px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.price}
                type="number"
                name="price"
                id="price"
                placeholder="Price"
              />
            </div>

            <div className="flex flex-col w-full gap-2">
              <label htmlFor="discount" className="text-lg">
                Discount (%)
              </label>
              <input
                className="px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md"
                onChange={inputHandle}
                value={state.discount}
                type="number"
                name="discount"
                id="discount"
                placeholder="Discount by %"
              />
            </div>
          </div>

          <div className="flex flex-col w-full gap-2 mb-5">
            <label htmlFor="description" className="text-lg text-white">
              Product Description
            </label>
            <textarea
              className="px-4 py-2 h-24 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md text-white"
              onChange={inputHandle}
              value={state.description}
              name="description"
              id="description"
              placeholder="Product Description"
            ></textarea>
          </div>

          <div className="flex flex-col w-full gap-2 mb-5">
            <label className="text-lg text-white">Product Image</label>
            <div className="flex items-center gap-4">
              {imageShow && (
                <div className="relative w-20 h-20 border border-slate-700 rounded-md overflow-hidden">
                  <img
                    src={imageShow}
                    className="w-full h-full object-cover"
                    alt="Product Preview"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-0 right-0 text-white bg-red-600 rounded-full"
                  >
                    <IoMdCloseCircle size={20} />
                  </button>
                </div>
              )}
              {!imageShow && (
                <label
                  htmlFor="image"
                  className="cursor-pointer flex items-center justify-center w-20 h-20 border-2 border-dashed border-slate-700 rounded-md text-gray-300 hover:border-indigo-700"
                >
                  <IoMdImages size={30} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={imageHandle}
                    accept="image/*"
                    id="image"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-start">
            <button
              disabled={loader === true}
              type="submit"
              className="bg-[#304C89] text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              {loader ? (
                <PropagateLoader
                  color="#fff"
                  cssOverride={overrideStyle}
                  size={10}
                />
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
