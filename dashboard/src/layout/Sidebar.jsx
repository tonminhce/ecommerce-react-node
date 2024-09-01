import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getNav } from '../navigation/index';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../store/Reducers/authReducer';
import logo from '../assets/logo.png';

const Sidebar = ({ showSidebar, setShowSidebar }) => {
    const dispatch = useDispatch();
    const { role } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [allNav, setAllNav] = useState([]);

    useEffect(() => {
        const navs = getNav(role);
        setAllNav(navs);
    }, [role]);

    return (
        <div>
            <div
                onClick={() => setShowSidebar(false)}
                className={`fixed duration-200 ${!showSidebar ? 'invisible' : 'visible'} w-screen h-screen bg-[#00000080] top-0 left-0 z-10`}
            />
            <div
                className={`w-[260px] fixed bg-blue-100 z-50 top-0 h-screen shadow-md transition-transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <div className='h-[70px] flex justify-center items-center bg-transparent'>
                    <Link to='/' className='w-[180px] h-[50px]'>
                        <img
                            className='mb-[10px]'
                            src={logo}
                            alt="Logo"
                        />
                    </Link>
                </div>
                <div className='px-4 py-2'>
                    <ul>
                        {allNav.map((n, i) => (
                            <li key={i}>
                                <Link
                                    to={n.path}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors duration-300 ${pathname === n.path ? 'bg-blue-600 text-white shadow-md' : 'text-gray-800 hover:bg-blue-200'}`}
                                >
                                    <span className='text-xl'>{n.icon}</span>
                                    <span className='font-semibold'>{n.title}</span>
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => dispatch(logout({ navigate, role }))}
                                className='flex items-center gap-4 px-4 py-3 rounded-md text-gray-800 hover:bg-red-100 transition-colors duration-300'
                            >
                                <span className='text-xl'><BiLogOutCircle /></span>
                                <span className='font-semibold'>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
