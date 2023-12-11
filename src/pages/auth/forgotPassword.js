import React, { useState } from 'react'
import Grid from '../../common/grid'
import Input from '../../common/input'
import Checkbox from '../../common/checkbox'
import { Link } from 'react-router-dom'
import Button from '../../common/button'
import { FaBeer } from "@react-icons/all-files/fa/FaBeer";
import Modal from '../../common/model'

// Media imports 
import Logo from '../../assets/images/logo.png'
import forgot from '../../assets/images/forgot_banner.png'
import email from '../../assets/images/email.png'

function ForgotPassword() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='bg-hero-pattern bg-cover	bg-no-repeat	bg-center	'>
       <Grid className='px-8 '>
           <div className='col-span-5'>
            <img src={forgot} className='h-screen object-contain py-5 w-full' alt='Logo '/>
              
           </div>
           <div className='col-span-6 self-center'>
            <div className='mx-auto max-w-md'>
            <img src={Logo} className='w-[224px]' alt='Logo '/>
            <p className='text-3xl mb-0 mt-4 font-bold text-light-black'><span className='text-neutral-grey'> Forgot </span> Your Password?</p>
             <p className='text-neutral-grey text-xl font-medium mt-4 mb-5'>Please enter the <b> email address </b> you'd like your password reset information sent to </p>
               <Input type='email' name='UserName' label='Email' placeholder='Enter' />
               <div>
               <Button className='w-full mt-3 h-[50px] text-lg font-semibold'  onClick={() => {openModal(true);}}>Request Reset Password</Button>

               <p className='text-base font-medium mt-4'><Link to={'/'} className='text-base font-medium text-light-black'>Back to Login</Link> </p>
               </div>
            </div>
              </div>
              <div className='col-span-1'></div>
       </Grid>

       {/* Modal Email Popop */}
       <Modal isOpen={isModalOpen} onClose={closeModal}>
      
        <div className='text-center py-3'>
          <img src={email} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-2 font-semibold text-neutral-grey'>Check your <span className='text-light-black'> Email </span></p>
          <p className='text-neutral-grey text-base font-medium mt-4'>We emailed a <b> magic link </b> to <span className='text-light-black'> jesicaahlberg184@gmail.com </span></p>
          <Link to={'/'} className='font-semibold text-base text-light-black'>Click the link to Sign In</Link>
        </div>
        
      </Modal>
    </div>
  )
}

export default ForgotPassword