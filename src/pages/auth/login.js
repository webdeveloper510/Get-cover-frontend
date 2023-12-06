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

function Login() {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleClick = () => {
    console.log('Button clicked!');
  };


  return (
    <div className='relative bg-hero-pattern bg-cover	bg-no-repeat	bg-center	'>
       <Grid className='px-8'>
           <div className='col-span-5'>
            <img src={Logi} className='py-5 lg:h-screen h-full md:mx-auto' alt='Logo '/>
           </div>
           <div className='col-span-6 self-center'>
            <div className='mx-auto max-w-md'>
            <img src={Logo} className='w-[224px]' alt='Logo '/>
            <p className='text-3xl mb-3 mt-4 font-bold text-light-black'><span className='text-neutral-grey'> Welcome to </span> GetCover</p>
             <p className='text-neutral-grey text-xl font-medium mb-5'><span className='font-semibold'> Sign in </span> to your account</p>
               <Input type='email' name='UserName' label='Email' placeholder='Enter' />
               <div>
               <PasswordInput type="password"
                  name="password"
                  label="Password"
                  placeholder=""
                  onChange={(e) => handlePasswordChange(e)}
                  isPassword />
               </div>
               <Grid className='my-2 py-3'>
                <div className='col-span-6'>
                  <Checkbox name="remember" label='Remember me'/>
                </div>
                <div className='col-span-6 text-end'>
                  <Link to={'/forgot'} className='text-base text-neutral-grey underline font-medium'> Forgot my password? </Link> 
                </div>
               </Grid>
               <div>
               <Button className='w-full h-[50px] text-xl font-semibold' onClick={handleClick}>Sign in</Button>

               <p className='text-base text-neutral-grey font-medium mt-4'>Don’t  have an account? <Link to={'/register'} className='text-light-black ml-3 font-semibold'><b> Register </b></Link> </p>
               </div>
            </div>
              </div>
              <div className='col-span-1'></div>
       </Grid>
    </div>
  )
}

export default Login