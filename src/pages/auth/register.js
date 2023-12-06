import React from 'react'

// Media Imports 
import ImageRegister from '../../assets/images/register-image.png'
import RegisterButton from '../../assets/images/register-Button.png'
import Back from '../../assets/images/back.png'
import Grid from '../../common/grid'
import Button from '../../common/button'
import { Link } from 'react-router-dom'

function Register() {
  return (
    <div className='bg-hero-pattern bg-no-repeat bg-cover p-4'>
    <div className='bg-hero-register bg-no-repeat bg-cover pt-1 rounded-[50px] mb-[70px]'>
    <Link to={'/'}><img src={Back} className='w-[40px] h-[40px] ms-4 mt-2' alt=' Back Image'/> </Link>
      <img src={ImageRegister} className='mx-auto h-[50%]' alt='Register Image' />
      <div className='text-center'>
       <p className='text-3xl mb-0 mt-4 font-bold text-neutral-grey'>Choose your <span className='text-light-black'> User type </span> </p>
       <p className='text-neutral-grey text-xl font-medium mb-5'>Below are the options you can choose from based <br/>  on your <b> account type </b>.</p>

       <Grid className=''>
        <div className='col-span-3'></div>
        <div className='col-span-3'>
          <div className='group drop-shadow-xl bg-white py-8 mb-[-40px] rounded-[30px] relative'>
             <p className='text-neutral-grey text-lg font-medium'>Register as</p>
             <p className='text-light-black font-semibold text-2xl mb-3'>Dealer</p>
             <div className='group-hover:block hidden'>
              <Button className='!bg-[#dfdfdf] absolute !px-2 rounded-[36px] left-1/2 transforms absolute'><Link to={'/register-dealer'}> <img src={RegisterButton} alt='Button Image' /> </Link></Button>
             </div>
          </div>
        </div>
        <div className='col-span-3'>
        <div className='group drop-shadow-xl bg-white py-8 mb-[-40px] rounded-[30px] relative'>
             <p className='text-neutral-grey text-lg font-medium'>Register as</p>
             <p className='text-light-black font-semibold text-2xl mb-3'>Service Provider</p>
             <div className='group-hover:block hidden'>
              <Button className='!bg-[#dfdfdf] absolute !px-2 rounded-[36px] left-1/2 transforms absolute'><Link to={'/register-provider'}><img src={RegisterButton} alt='Button Image' /> </Link></Button>
             </div>
          </div>
        </div>
        <div className='col-span-3'></div>
       </Grid>
      </div>
    </div>
    </div>
  )
}

export default Register