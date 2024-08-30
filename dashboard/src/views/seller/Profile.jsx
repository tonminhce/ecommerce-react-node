import React, { useEffect, useState } from 'react';
import { FaImages } from "react-icons/fa6";
import { FadeLoader, PropagateLoader } from 'react-spinners';
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { profile_image_upload, messageClear, profile_info_add } from '../../store/Reducers/authReducer';
import toast from 'react-hot-toast';
import { overrideStyle } from '../../utils/utils';
import { create_stripe_connect_account } from '../../store/Reducers/sellerReducer';

const Profile = () => {
    const [state, setState] = useState({
        division: '',
        district: '',
        shopName: '',
        sub_district: ''
    });

    const dispatch = useDispatch();
    const { userInfo, loader, successMessage } = useSelector(state => state.auth);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, dispatch]);

    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            dispatch(profile_image_upload(formData));
        }
    };

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const add = (e) => {
        e.preventDefault();
        dispatch(profile_info_add(state));
    };

    return (
        <div className='px-4 lg:px-8 py-6'>
            <div className='w-full flex flex-wrap'>
                <div className='w-full md:w-6/12'>
                    <div className='w-full p-4 bg-blue-100 rounded-md shadow-lg'>
                        <div className='flex justify-center items-center py-3'>
                            {
                                userInfo?.image ? (
                                    <label htmlFor="img" className='h-[150px] w-[200px] relative p-3 cursor-pointer overflow-hidden'>
                                        <img src={userInfo.image} alt="Profile" className='w-full h-full object-cover rounded-md' />
                                        {loader && (
                                            <div className='bg-gray-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                                                <FadeLoader color="#ffffff" />
                                            </div>
                                        )}
                                    </label>
                                ) : (
                                    <label className='flex justify-center items-center flex-col h-[150px] w-[200px] cursor-pointer border border-dashed hover:border-blue-400 border-gray-400 relative bg-gray-200 rounded-md'>
                                        <span><FaImages className='text-gray-500' /></span>
                                        <span>Select Image</span>
                                        {loader && (
                                            <div className='bg-gray-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20'>
                                                <FadeLoader color="#ffffff" />
                                            </div>
                                        )}
                                    </label>
                                )
                            }
                            <input onChange={add_image} type="file" className='hidden' id='img' />
                        </div>

                        <div className='px-0 md:px-5 py-2'>
                            <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-gray-50 rounded-md shadow-md'>
                                <span className='p-1 bg-yellow-400 rounded hover:shadow-lg hover:shadow-yellow-300/50 absolute right-2 top-2 cursor-pointer'>
                                    <FaRegEdit />
                                </span>
                                <div className='flex gap-2'>
                                    <span>Name:</span>
                                    <span>{userInfo.name}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Email:</span>
                                    <span>{userInfo.email}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Role:</span>
                                    <span>{userInfo.role}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Status:</span>
                                    <span>{userInfo.status}</span>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Payment Account:</span>
                                    <p>
                                        {
                                            userInfo.payment === 'active' ? (
                                                <span className='bg-green-400 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded'>
                                                    {userInfo.payment}
                                                </span>
                                            ) : (
                                                <span onClick={() => dispatch(create_stripe_connect_account())} className='bg-blue-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded'>
                                                    Click to Activate
                                                </span>
                                            )
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='px-0 md:px-5 py-2'>
                            {
                                !userInfo?.shopInfo ? (
                                    <form onSubmit={add}>
                                        <div className='flex flex-col w-full gap-1 mb-2'>
                                            <label htmlFor="Shop">Shop Name</label>
                                            <input value={state.shopName} onChange={inputHandle} className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="text" name='shopName' id='Shop' placeholder='Shop Name' />
                                        </div>

                                        <div className='flex flex-col w-full gap-1 mb-2'>
                                            <label htmlFor="division">Division Name</label>
                                            <input value={state.division} onChange={inputHandle} className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="text" name='division' id='division' placeholder='Division Name' />
                                        </div>

                                        <div className='flex flex-col w-full gap-1 mb-2'>
                                            <label htmlFor="district">District Name</label>
                                            <input value={state.district} onChange={inputHandle} className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="text" name='district' id='district' placeholder='District Name' />
                                        </div>

                                        <div className='flex flex-col w-full gap-1 mb-2'>
                                            <label htmlFor="sub">Sub District Name</label>
                                            <input value={state.sub_district} onChange={inputHandle} className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="text" name='sub_district' id='sub' placeholder='Sub District Name' />
                                        </div>

                                        <button disabled={loader} className='bg-red-500 w-full hover:shadow-red-400/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                                            {
                                                loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Save Changes'
                                            }
                                        </button>
                                    </form>
                                ) : (
                                    <div className='flex justify-between text-sm flex-col gap-2 p-4 bg-gray-50 rounded-md shadow-md'>
                                        <span className='p-1 bg-yellow-400 rounded hover:shadow-lg hover:shadow-yellow-300/50 absolute right-2 top-2 cursor-pointer'>
                                            <FaRegEdit />
                                        </span>
                                        <div className='flex gap-2'>
                                            <span>Shop Name:</span>
                                            <span>{userInfo.shopInfo?.shopName}</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <span>Division:</span>
                                            <span>{userInfo.shopInfo?.division}</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <span>District:</span>
                                            <span>{userInfo.shopInfo?.district}</span>
                                        </div>
                                        <div className='flex gap-2'>
                                            <span>Sub District:</span>
                                            <span>{userInfo.shopInfo?.sub_district}</span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className='w-full md:w-6/12'>
                    <div className='w-full pl-0 md:pl-7 mt-6 md:mt-0'>
                        <div className='bg-blue-100 rounded-md shadow-lg p-4'>
                            <h1 className='text-gray-700 text-lg mb-3 font-semibold'>Change Password</h1>
                            <form>
                                <div className='flex flex-col w-full gap-1 mb-2'>
                                    <label htmlFor="email">Email</label>
                                    <input className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="email" name='email' id='email' placeholder='Email' />
                                </div>

                                <div className='flex flex-col w-full gap-1 mb-2'>
                                    <label htmlFor="o_password">Old Password</label>
                                    <input className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="password" name='old_password' id='o_password' placeholder='Old Password' />
                                </div>

                                <div className='flex flex-col w-full gap-1 mb-2'>
                                    <label htmlFor="n_password">New Password</label>
                                    <input className='px-4 py-2 focus:border-blue-500 outline-none bg-white border border-gray-300 rounded-md text-gray-700' type="password" name='new_password' id='n_password' placeholder='New Password' />
                                </div>

                                <button className='bg-red-500 hover:shadow-red-400/50 hover:shadow-lg text-white rounded-md px-7 py-2 my-2'>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
