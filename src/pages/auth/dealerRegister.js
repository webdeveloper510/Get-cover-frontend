import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Grid from '../../common/grid'
import Input from '../../common/input'
import Button from '../../common/button'
import PasswordInput from '../../common/passwordInput'
import Select from '../../common/select'
import Modal from '../../common/model'


// Media imports 
import Logo from '../../assets/images/logo.png'
import Logi from '../../assets/images/login.png'
import email from '../../assets/images/approval-image.png'

function DealerRegister() {
    const [password, setPassword] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
  return (
    <div className='relative bg-hero-pattern bg-cover	bg-no-repeat	bg-center	'>
       <Grid className='px-8'>
           <div className='col-span-6 self-center'>
            <div className='mx-auto max-w-md'>
            <img src={Logo} className='w-[224px]' alt='Logo '/>
            <p className='text-3xl mb-0 mt-3 font-bold text-light-black'><span className='text-neutral-grey'> Welcome to </span> GetCover</p>
             <p className='text-neutral-grey text-xl font-medium mb-4 mt-2'> Sign up to your <span className='font-semibold'> Dealer’s Account </span> </p>
              <form>
                <Grid className='!gap-y-0'>
                    <div className='col-span-6'>
                        <Input type='text' name='accountName' label='Account Name' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='Email' label='Email' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='firstName' label='First Name' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='lastName' label='Last Name' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Input type='number' name='mobileNumber' label='Mobile Number' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <PasswordInput type="password" name="password" label="Password" placeholder="" onChange={(e) => handlePasswordChange(e)} isPassword />
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='address' label='Street Address' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Select label="City"
                            options={options}
                            selectedValue={selectedValue}
                            onChange={handleSelectChange}/>
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='State' label='State' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='Country' label='Country' placeholder='Enter' />
                    </div>
                </Grid>
              </form>
               <div>
               <Button className='w-full h-[50px] text-xl font-semibold' onClick={() => {openModal(true);}}>Register</Button>

               <p className='text-base text-neutral-grey font-medium mt-4'>Don’t  have an account? <Link to={'/'} className='text-light-black ml-3 font-semibold'><b> Sign In </b></Link> </p>
               </div>
            </div>
              </div>
              <div className='col-span-1'></div>
           <div className='col-span-5'>
            <img src={Logi} className='py-4  h-full md:mx-auto' alt='Logo '/>
           </div>
       </Grid>
       <Modal isOpen={isModalOpen} onClose={closeModal}>
      
        <div className='text-center py-3'>
          <img src={email} alt='email Image' className='mx-auto py-8'/>
          <p className='text-3xl mb-0 mt-2 font-semibold text-neutral-grey'>Please wait it will take time for <span className='text-light-black'> Approval </span></p>
          <p className='text-neutral-grey text-base font-medium mt-4'>For some security reasons you <b> require an approval. </b> It will be executed </p>
          <Link to={'/'} className='font-medium text-base text-neutral-grey'>as soon as the approver will validate the action.</Link>
        </div>
        
      </Modal>
    </div>
  )
}

export default DealerRegister