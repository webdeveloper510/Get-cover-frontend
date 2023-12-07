import React, { useState } from 'react'
import Headbar from '../../common/headBar'
import { Link } from 'react-router-dom'
import Select from '../../common/select';
import Grid from '../../common/grid';
import Input from '../../common/input';

// Media Include
import BackImage from '../../assets/images/icons/backArrow.svg'
import Button from '../../common/button';
import RadioButton from '../../common/radio';

function Dashboard() {
  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex'>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	'>Dashboad</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-normal'><Link to={'/'}>Dashboad </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Dashboad </li>
            </ul>
          </div>
        </div>
     </div>
    </>
  )
}

export default Dashboard