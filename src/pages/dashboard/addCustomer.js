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

function AddCustomer() {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedOption, setSelectedOption] = useState('option1');
  
    const handleRadioChange = (event) => {
      setSelectedOption(event.target.value);
    };
    const handleSelectChange = (e) => {
      setSelectedValue(e.target.value);
    };
    const handleSelectChange1 = (e) => {
      setSelectedCity(e.target.value);
    };
  
    const country = [
      { label: 'Country', value: 'country' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];
    const city = [
      { label: 'Country', value: 'country' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];
  
    return (
      <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex'>
        <Link to={'/category'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
            <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
          </Link>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9 mb-[3px]'>Add New Customer</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Dealer </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Add New Customer </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
  
        <form className='mt-8'>
          <Grid>
          <div className='col-span-5 mb-3'>
            <Select label="Dealer Name"
              options={country}
              required={true}
              selectedValue={selectedValue}
              onChange={handleSelectChange}/>
          </div>
          </Grid>
          <div className='bg-white p-4 drop-shadow-4xl border-[1px] border-[#D1D1D1] rounded-xl'>
            <Grid>
              <div className='col-span-5 border-e-[1px] border-[#D1D1D1] pr-3'>
                <Grid>
                  <div className='col-span-12 mt-2'>
                    <Input type='text' name='customerAccountName' className='!bg-white' required={true} label='Customer Account Name' placeholder='Enter'  />
                  </div>
                  <div className='col-span-12'>
                    <div className='flex'>
                      <p className='text-neutral-grey'>Address</p>
                      <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
                    </div>
                  </div>
                  <div className='col-span-12'>
                    <Input type='text' name='customerStreetAddress' className='!bg-white' required={true} label='Customer Street Address' placeholder='Enter' />
                  </div>
                  <div className='col-span-12'>
                    <Select label="City"
                    required={true}
                    options={city}
                    className='!bg-white'
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-12'>
                    <Select label="State"
                    options={city}
                    className='!bg-white'
                    required={true}
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-12'>
                    <Input type='text' name='zipcode' className='!bg-white' label='Zipcode' required={true} placeholder='Enter' />
                  </div>
                </Grid>
              </div>
              <div className='col-span-7'>
                <p className='text-light-black text-lg font-semibold'>Contact Information</p>
                <p className='text-light-black flex text-[14px]  font-semibold mt-3 mb-6' >Do you want to create an account?       
                <RadioButton
                  id="yes"
                  label="Yes"
                  value="yes"
                  checked={selectedOption === 'yes'}
                  onChange={handleRadioChange}
                />
  
                <RadioButton
                  id="no"
                  label="No"
                  value="no"
                  checked={selectedOption === 'no'}
                  onChange={handleRadioChange}
                />
                 </p>
                <Grid>
                  <div className='col-span-6'>
                      <Input type='text' name='fName' className='!bg-white' required={true} label='First Name' placeholder='Enter' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='lName' className='!bg-white' label='Last Name' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='email' name='email' className='!bg-white' label='Email' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='phone' className='!bg-white' label='Phone' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-12'>
                      <Input type='text' name='Position' className='!bg-white' label='Position' required={true} placeholder='Enter'/>
                  </div>
                </Grid>
              </div>
            </Grid>
          </div>
  
          <Button className='mt-4' >Submit</Button>
        </form>
      </div>
    )
  }

export default AddCustomer