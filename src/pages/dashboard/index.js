import React, { useState } from 'react'
import Headbar from '../../common/headBar'
import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex'>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	'>Dashboard</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Dashboard </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Dashboard </li>
            </ul>
          </div>
        </div>
     </div>
    </>
  )
}

export default Dashboard