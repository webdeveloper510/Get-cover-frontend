import React from 'react'
import Grid from '../../common/grid'
import Input from '../../common/input'
import Checkbox from '../../common/checkbox'
import { Link } from 'react-router-dom'
import Button from '../../common/button'

// Media imports 
import Logo from '../../assets/images/logo.png'
import Logi from '../../assets/images/login.png'

function Login() {


  const handleClick = () => {
    console.log('Button clicked!');
  };


  return (
    <div>
       <Grid className='px-8'>
           <div className='col-span-6'>
            <img src={Logi} className='h-screen' alt='Logo '/>
              
           </div>
           <div className='col-span-6 pr-6'>
            <img src={Logo} className='w-[224px]' alt='Logo '/>
            <p className='text-5xl mb-4 mt-5 font-bold text-light-black'><span className='text-neutral-grey'> Welcome to </span> GetCover</p>
             <p className='text-neutral-grey text-xl mb-8'><b> Sign in </b> to your account</p>
             
               <Input type='text' name='UserName' label='Email' placeholder='Enter' />
               <Input type='password' name='UserName' label='Password' placeholder='Enter' />
               <Grid className='my-4 p-3'>
                <div className='col-span-6'>
                  <Checkbox name="remember" label='Remember me'/>
                </div>
                <div className='col-span-6 text-end'>
                  <Link to={'/'} className='text-base text-neutral-grey'> Forgot my password? </Link> 
                </div>
               </Grid>
               <div>
               <Button className='w-full h-[68px]' onClick={handleClick}>Sign in</Button>

               <p className='text-base text-neutral-grey mt-4'>Don’t  have an account? <Link to={'/'} className='text-light-black'>Register</Link> </p>
               </div>
              </div>
       </Grid>
    </div>
  )
}

export default Login