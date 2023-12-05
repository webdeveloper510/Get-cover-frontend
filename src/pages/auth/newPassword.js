import React, { useState } from 'react'
import Grid from '../../common/grid'
import Input from '../../common/input'
import { Link } from 'react-router-dom'
import Button from '../../common/button'


// Media imports 
import Logo from '../../assets/images/logo.png'
import NewPasswordImage from '../../assets/images/new_password.png'
import NewPasswordEmail from '../../assets/images/reset-password.png'
import Cross from '../../assets/images/Cross.png'
import PasswordInput from '../../common/passwordInput'
import Modal from '../../common/model'


function NewPassword() {
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
  return (
    <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
       <Grid className='px-8 '>
           <div className='col-span-5'>
            <img src={NewPasswordImage} className='h-screen object-contain py-5 w-full' alt='Logo '/>
              
           </div>
           <div className='col-span-6 self-center'>
            <div className='mx-auto max-w-md'>
            <img src={Logo} className='w-[224px]' alt='Logo '/>
            <p className='text-3xl mb-0 mt-4 font-bold text-light-black'><span className='text-neutral-grey'> Enter </span> New Password</p>
             <p className='text-neutral-grey text-xl font-medium mt-4 mb-5'>Strong passwords include  <b> numbers, letters, </b> and <b> punctuation marks </b>.</p>
                 <PasswordInput type="password"
                  name="password"
                  label="New Password"
                  placeholder=""
                  onChange={(e) => handlePasswordChange(e)}
                  isPassword />

                 <PasswordInput type="password"
                  name="password"
                  label="Confirm Password"
                  placeholder=""
                  onChange={(e) => handlePasswordChange(e)}
                  isPassword />
               <div>
               <Button className='w-full h-[50px] text-lg font-semibold'  onClick={() => {openModal(true);}} >Reset Password</Button>
               </div>
            </div>
              </div>
              <div className='col-span-1'></div>
       </Grid>

       {/* Modal Email Popop */}
       <Modal isOpen={isModalOpen} onClose={closeModal}>
       <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button>
        <div className='text-center py-3'>
          <img src={NewPasswordEmail} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'>Password <span className='text-light-black'> Reset Successfully </span></p>
          <p className='text-neutral-grey text-base font-medium mt-4'>Your password has been changed. Now you can </p>
          <Link to={'/login'} className='font-medium text-base text-neutral-grey'>  <b> login </b> with your new password.</Link>
        </div>
        
      </Modal>
    </div>
  )
}

export default NewPassword