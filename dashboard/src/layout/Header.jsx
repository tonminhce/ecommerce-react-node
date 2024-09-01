import React from 'react';
import { FaList } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = ({ showSidebar, setShowSidebar }) => {
  const { userInfo } = useSelector(state => state.auth);

  return (
    <div className='top-0 left-0 w-full py-4 px-4 lg:px-8 z-40'>
      <div className='ml-0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-gradient-to-r from-indigo-400 to-blue-500 px-6 transition-all shadow-lg'>

        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className='w-[40px] h-[40px] lg:hidden rounded-md bg-indigo-700 shadow-md hover:shadow-indigo-500/50 flex justify-center items-center cursor-pointer transition-transform transform hover:scale-105'>
          <span className='text-white text-xl'><FaList /></span>
        </div>

        <div className='hidden md:block'>
        </div>

        <div className='flex justify-center items-center gap-6'>
          <div className='flex items-center gap-3'>
            <div className='flex flex-col text-end'>
              <h2 className='text-lg font-bold text-white'>{userInfo.name}</h2>
              <span className='text-sm text-gray-200'>{userInfo.role}</span>
            </div>
            <img
              className='w-[50px] h-[50px] rounded-full border-2 border-white'
              src={userInfo.role === 'admin' ? "http://localhost:3001/images/admin.jpg" : userInfo.image}
              alt={userInfo.name}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
