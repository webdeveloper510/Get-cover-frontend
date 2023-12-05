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

  const handleClick = () => {
    console.log('Button clicked!');
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
       <Grid className='px-8'>
           <div className='col-span-5'>
            <img src={forgot} className='h-screen object-contain py-5 w-full' alt='Logo '/>
              
           </div>
           <div className='col-span-7 self-center'>
            <div className='mx-auto max-w-lg'>
            <img src={Logo} className='w-[224px]' alt='Logo '/>
            <p className='text-4xl mb-4 mt-5 font-bold font-normal text-light-black'><span className='text-neutral-grey'> Forgot </span> Your Password?</p>
             <p className='text-neutral-grey text-xl font-normal mb-8'>Please enter the <b> email address </b> you'd like your password reset information sent to </p>
               <Input type='text' name='UserName' label='Email' placeholder='Enter' />
               <div>
               <Button className='w-full h-[50px] text-lg font-normal'  onClick={() => {openModal(true);}}>Request Reset Password</Button>

               <p className='text-base mt-4'><Link to={'/login'} className='text-light-black'>Back to Login</Link> </p>
               </div>
            </div>
              </div>
       </Grid>

       {/* Modal Email Popop */}
       <Modal isOpen={isModalOpen} onClose={closeModal}>
      
        <div className='text-center py-5'>
          <img src={email} alt='email Image'/>
          <p className='text-4xl text-neutral-grey text-center'>Check your <span className='text-light-black'> Email </span></p>
          <p className='text-neutral-grey text-sm font-extralight mt-4'>We emailed a magic link to <span className='text-light-black'> jesicaahlberg184@gmail.com </span></p>
          <Link to={'/login'} className='font-extralight text-base text-neutral-grey'>Click the link to Sign In</Link>
        </div>
        
      </Modal>
    </div>
  )
}

export default ForgotPassword