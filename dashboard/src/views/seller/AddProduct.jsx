import React, { useEffect, useState } from 'react';
import { IoMdImages, IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear } from '../../store/Reducers/productReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categorys } = useSelector(state => state.category);
    const { loader, successMessage, errorMessage } = useSelector(state => state.product);

    useEffect(() => {
        dispatch(get_category({
            searchValue: '',
            parPage: '',
            page: ""
        }));
    }, [dispatch]);

    const [state, setState] = useState({
        name: "",
        description: '',
        discount: '',
        price: "",
        brand: "",
        stock: ""
    });

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const categorySearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
            setAllCategory(srcValue);
        } else {
            setAllCategory(categorys);
        }
    };

    const [images, setImages] = useState([]);
    const [imageShow, setImageShow] = useState([]);

    const imageHandle = (e) => {
        const files = e.target.files;
        const length = files.length;
        if (length > 0) {
            setImages([...images, ...files]);
            let imageUrl = [];
            for (let i = 0; i < length; i++) {
                imageUrl.push({ url: URL.createObjectURL(files[i]) });
            }
            setImageShow([...imageShow, ...imageUrl]);
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
            setState({
                name: "",
                description: '',
                discount: '',
                price: "",
                brand: "",
                stock: ""
            });
            setImageShow([]);
            setImages([]);
            setCategory('');
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const changeImage = (img, index) => {
        if (img) {
            let tempUrl = imageShow;
            let tempImages = images;

            tempImages[index] = img;
            tempUrl[index] = { url: URL.createObjectURL(img) };
            setImageShow([...tempUrl]);
            setImages([...tempImages]);
        }
    };

    const removeImage = (i) => {
        const filterImage = images.filter((img, index) => index !== i);
        const filterImageUrl = imageShow.filter((img, index) => index !== i);

        setImages(filterImage);
        setImageShow(filterImageUrl);
    };

    const add = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', state.name);
        formData.append('description', state.description);
        formData.append('price', state.price);
        formData.append('stock', state.stock);
        formData.append('discount', state.discount);
        formData.append('brand', state.brand);
        formData.append('shopName', 'EasyShop');
        formData.append('category', category);

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
        dispatch(add_product(formData));
    };

    useEffect(() => {
        setAllCategory(categorys);
    }, [categorys]);

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-6 bg-gradient-to-r from-[#4b5db2] to-[#6a5fdf] rounded-lg shadow-lg'>
                <h2 className='text-2xl font-semibold text-white mb-5'>Add New Product</h2>
                <form onSubmit={add}>
                    <div className='flex flex-col mb-4 md:flex-row gap-4 w-full text-white'>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="name" className='text-lg'>Product Name</label>
                            <input
                                className='px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                onChange={inputHandle}
                                value={state.name}
                                type="text"
                                name='name'
                                id='name'
                                placeholder='Product Name'
                            />
                        </div>

                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="brand" className='text-lg'>Product Brand</label>
                            <input
                                className='px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                onChange={inputHandle}
                                value={state.brand}
                                type="text"
                                name='brand'
                                id='brand'
                                placeholder='Brand Name'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col mb-4 md:flex-row gap-4 w-full text-white'>
                        <div className='flex flex-col w-full gap-2 relative'>
                            <label htmlFor="category" className='text-lg'>Category</label>
                            <input
                                readOnly
                                onClick={() => setCateShow(!cateShow)}
                                className='px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                value={category}
                                type="text"
                                id='category'
                                placeholder='-- Select Category --'
                            />

                            <div className={`absolute top-[100%] left-0 bg-[#475569] w-full transition-transform duration-300 transform ${cateShow ? 'scale-100' : 'scale-0'}`}>
                                <div className='w-full p-3'>
                                    <input
                                        value={searchValue}
                                        onChange={categorySearch}
                                        className='px-3 py-1 w-full focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                        type="text"
                                        placeholder='Search'
                                    />
                                </div>
                                <div className='flex flex-col h-48 overflow-y-auto'>
                                    {allCategory.map((c, i) => (
                                        <span
                                            key={i}
                                            className={`px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer ${category === c.name ? 'bg-indigo-500' : ''}`}
                                            onClick={() => {
                                                setCateShow(false);
                                                setCategory(c.name);
                                                setSearchValue('');
                                                setAllCategory(categorys);
                                            }}
                                        >
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="stock" className='text-lg'>Product Stock</label>
                            <input
                                className='px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                onChange={inputHandle}
                                value={state.stock}
                                type="text"
                                name='stock'
                                id='stock'
                                placeholder='Stock'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col mb-4 md:flex-row gap-4 w-full text-white'>
                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="price" className='text-lg'>Price</label>
                            <input
                                className='px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                onChange={inputHandle}
                                value={state.price}
                                type="number"
                                name='price'
                                id='price'
                                placeholder='Price'
                            />
                        </div>

                        <div className='flex flex-col w-full gap-2'>
                            <label htmlFor="discount" className='text-lg'>Discount (%)</label>
                            <input
                                className='px-4 py-2 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md'
                                onChange={inputHandle}
                                value={state.discount}
                                type="number"
                                name='discount'
                                id='discount'
                                placeholder='Discount by %'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-2 mb-5'>
                        <label htmlFor="description" className='text-lg text-white'>Product Description</label>
                        <textarea
                            className='px-4 py-2 h-24 focus:border-indigo-700 outline-none bg-transparent border border-slate-700 rounded-md text-white'
                            onChange={inputHandle}
                            value={state.description}
                            name='description'
                            id='description'
                            placeholder='Product Description'
                        ></textarea>
                    </div>

                    <div className='flex flex-col w-full gap-2 mb-5'>
                        <label className='text-lg text-white'>Product Images</label>
                        <div className='flex items-center flex-wrap gap-4'>
                            {imageShow.map((img, i) => (
                                <div key={i} className='relative w-20 h-20 border border-slate-700 rounded-md overflow-hidden'>
                                    <img className='w-full h-full object-cover' src={img.url} alt="product" />
                                    <span
                                        onClick={() => removeImage(i)}
                                        className='absolute top-0 right-0 m-1 text-white cursor-pointer hover:text-red-600'
                                    >
                                        <IoMdCloseCircle />
                                    </span>
                                </div>
                            ))}
                            <div className='relative w-20 h-20 border-2 border-dashed border-slate-500 flex items-center justify-center rounded-md cursor-pointer hover:border-indigo-700'>
                                <input
                                    onChange={imageHandle}
                                    className='absolute inset-0 opacity-0 cursor-pointer'
                                    type="file"
                                    id='image'
                                    multiple
                                />
                                <IoMdImages className='text-2xl text-slate-500' />
                            </div>
                        </div>
                    </div>

                    <div className='w-full'>
                        <button
                            disabled={loader === true}
                            className='w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300'
                        >
                            {loader ? <PropagateLoader cssOverride={overrideStyle} size={10} color="#fff" /> : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
