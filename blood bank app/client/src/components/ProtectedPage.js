import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { GetCurrentUser } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUserName } from '../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { SetCurrentUser } from '../redux/userSlice';
import { SetLoading } from '../redux/loaderSlice';

function ProtectedPage({children}) {
  const {currentUser} = useSelector((state)=> state.users);
  const navigate= useNavigate();
  const dispatch = useDispatch();
  const getCurrentUser= async()=>{
    try {
        dispatch(SetLoading(true));
        const response= await GetCurrentUser();
        dispatch(SetLoading(false));
        if(response.success){
            message.success(response.message);
            dispatch(SetCurrentUser(response.data));
        }
        else{
            // throw new Error(response.message);
            localStorage.removeItem("token");
            navigate("/login");
        }
    } catch (error) {
        dispatch(SetLoading(false));
        message.error(error.message);
        localStorage.removeItem("token");
        navigate("/login");
    }
  }

  useEffect(()=>{
    if(localStorage.getItem("token")){
      getCurrentUser();
    }else{
      navigate("/login");
    }
  },[]);

  return (
   currentUser && (
    <>
       {/* header  */}
      <div className='flex justify-between items-center bg-primary text-white px-5 py-3 mx-5 rounded-b'>
        <div onClick={()=> navigate("/")} className='cursor-pointer'>
        <h1 className='text-2xl'>YASH BLOODBANK</h1>
        <span className='text-xs'>
            {currentUser.userType.toUpperCase()}
        </span>
        </div>
        
        <div className='flex items-center gap-1'>
        <i className="ri-shield-user-fill"></i>
          <div className='flex flex-col'>
           <span className='mr-5 text-md cursor-pointer' onClick={()=> navigate("/profile")}>

           {getLoggedInUserName(currentUser).toUpperCase()}
           </span>
          </div>
          <i className="ri-logout-circle-r-line ml-5 cursor-pointer" onClick={()=>{
            localStorage.removeItem("token");
            navigate("/login")
          }}></i>
        </div>
      </div>

      {/* body  */}
      <div className='px-5 py-5'>{children}</div>
    </>
   )
  );
}

export default ProtectedPage
