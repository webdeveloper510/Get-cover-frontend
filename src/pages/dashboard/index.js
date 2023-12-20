import React, { useEffect, useState } from 'react'
import Headbar from '../../common/headBar'
import { Link } from 'react-router-dom'

function Dashboard() {
  useEffect(()=>{
    console.log("yes")
  })
  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex mt-2'>
          <div className='pl-3'>
            <p className='font-semibold text-[36px] leading-9	mb-[3px]'>Dashboard</p>
           
          </div>
        </div>
     </div>
    </>
  )
}

export default Dashboard