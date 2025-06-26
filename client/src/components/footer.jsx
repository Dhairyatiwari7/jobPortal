import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom";

const footer = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const Navigate=useNavigate();
  return (
    <div className='container px-4 2xl:px-20 mx-auto flex items-center justify-between gap-4 py-3 mt-20'>
        <img onClick={()=>Navigate("/")} className='cursor-pointer' width={160} src={assets.logo}></img>
        <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>All right reserved. Copyright @job-portal</p>
        <div className='flex gap-2.5'>
            <img width={38} src={assets.facebook_icon} alt="" />
            <img width={38} src={assets.twitter_icon} alt="" />
            <img width={38} src={assets.instagram_icon} alt="" />
        </div>
    </div> 
  )
}

export default footer