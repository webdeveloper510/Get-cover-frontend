import React, { useState } from 'react'
import Grid from '../../common/grid'
import Input from '../../common/input'
import Checkbox from '../../common/checkbox'
import { Link } from 'react-router-dom'
import Button from '../../common/button'
import { LuEye, LuEyeOff } from "react-icons/lu";


// Media imports 
import Logo from '../../assets/images/logo.png'
import Logi from '../../assets/images/login.png'
import PasswordInput from '../../common/passwordInput'
import Select from '../../common/select'

function RegisterForm() {
    const [password, setPassword] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleClick = () => {
    console.log('Button clicked!');
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
            <p className='text-3xl mb-0 mt-4 font-bold text-light-black'><span className='text-neutral-grey'> Welcome to </span> GetCover</p>
             <p className='text-neutral-grey text-xl font-medium mb-5 mt-3'> Sign up to your <span className='font-semibold'> Dealer’s Account </span> </p>
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
                        <Input type='text' name='lastName' label='State' placeholder='Enter' />
                    </div>
                    <div className='col-span-6'>
                        <Input type='text' name='lastName' label='Country' placeholder='Enter' />
                    </div>
                </Grid>
              </form>
               <div>
               <Button className='w-full h-[50px] text-xl font-semibold' onClick={handleClick}>Register</Button>

               <p className='text-base text-neutral-grey font-medium mt-4'>Don’t  have an account? <Link to={'/'} className='text-light-black ml-3 font-semibold'><b> Sign In </b></Link> </p>
               </div>
            </div>
              </div>
              <div className='col-span-1'></div>
           <div className='col-span-5'>
            <img src={Logi} className='py-5  h-full md:mx-auto' alt='Logo '/>
           </div>
       </Grid>
    </div>
  )
}

export default RegisterForm