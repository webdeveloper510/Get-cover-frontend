import React from 'react'
import Headbar from '../../common/headBar'
import BackImage from '../../assets/images/icons/backArrow.svg'
import date from '../../assets/images/icons/date.svg'
import time from '../../assets/images/icons/time.svg'
import { Link } from 'react-router-dom'
function Notification() {
  return (
    <div className='my-8 ml-3 relative overflow-x-hidden'>
        <Headbar className="!top-0"/>
        <div className='flex'>
        <Link to={'/dashboard'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
            <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
          </Link>
          <div className='pl-3'>
            <p className='font-semibold text-[36px] leading-9 mb-[3px]'>Notifications</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Servicer </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Notifications </li>
            </ul>
          </div>
        </div>

            <div className='mt-8'>
                <div className='border border-[#D9D9D9] rounded-[25px] mb-5 px-6 py-8 mr-4'>
                    <p className='font-semibold text-lg'>New Registration: Finibus Bonorum et Malorum</p>
                    <p className='mb-6 text-base text-[#999999] font-Regular'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface <br/> without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</p>
                    <div className='flex'>
                        <div className='flex mr-10 font-Regular'>
                            <img src={date} className='mr-2' alt='date'/>
                            <p><b> Date : </b> 24 Nov 2023</p>
                        </div>
                        <div className='flex font-Regular'>
                            <img src={time} className='mr-2' alt='Time'/>
                            <p><b> Time : </b> 9:30 AM</p>
                        </div>
                    </div>
                </div>

                <div className='border border-[#D9D9D9] rounded-[25px] mb-5 px-6 py-8 mr-4'>
                    <p className='font-semibold text-lg'>New Registration: Finibus Bonorum et Malorum</p>
                    <p className='mb-6 text-base text-[#999999] font-Regular'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface <br/> without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</p>
                    <div className='flex'>
                        <div className='flex mr-10 font-Regular'>
                            <img src={date} className='mr-2' alt='date'/>
                            <p><b> Date : </b> 24 Nov 2023</p>
                        </div>
                        <div className='flex font-Regular'>
                            <img src={time} className='mr-2' alt='Time'/>
                            <p><b> Time : </b> 9:30 AM</p>
                        </div>
                    </div>
                </div>
                <div className='border border-[#D9D9D9] rounded-[25px] mb-5 px-6 py-8 mr-4'>
                    <p className='font-semibold text-lg'>New Registration: Finibus Bonorum et Malorum</p>
                    <p className='mb-6 text-base text-[#999999] font-Regular'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface <br/> without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</p>
                    <div className='flex'>
                        <div className='flex mr-10 font-Regular'>
                            <img src={date} className='mr-2' alt='date'/>
                            <p><b> Date : </b> 24 Nov 2023</p>
                        </div>
                        <div className='flex font-Regular'>
                            <img src={time} className='mr-2' alt='Time'/>
                            <p><b> Time : </b> 9:30 AM</p>
                        </div>
                    </div>
                </div>
                <div className='border border-[#D9D9D9] rounded-[25px] mb-5 px-6 py-8 mr-4'>
                    <p className='font-semibold text-lg'>New Registration: Finibus Bonorum et Malorum</p>
                    <p className='mb-6 text-base text-[#999999] font-Regular'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface <br/> without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</p>
                    <div className='flex'>
                        <div className='flex mr-10 font-Regular'>
                            <img src={date} className='mr-2' alt='date'/>
                            <p><b> Date : </b> 24 Nov 2023</p>
                        </div>
                        <div className='flex font-Regular'>
                            <img src={time} className='mr-2' alt='Time'/>
                            <p><b> Time : </b> 9:30 AM</p>
                        </div>
                    </div>
                </div>
                <div className='border border-[#D9D9D9] rounded-[25px] mb-5 px-6 py-8 mr-4'>
                    <p className='font-semibold text-lg'>New Registration: Finibus Bonorum et Malorum</p>
                    <p className='mb-6 text-base text-[#999999] font-Regular'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface <br/> without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</p>
                    <div className='flex'>
                        <div className='flex mr-10 font-Regular'>
                            <img src={date} className='mr-2' alt='date'/>
                            <p><b> Date : </b> 24 Nov 2023</p>
                        </div>
                        <div className='flex font-Regular'>
                            <img src={time} className='mr-2' alt='Time'/>
                            <p><b> Time : </b> 9:30 AM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Notification