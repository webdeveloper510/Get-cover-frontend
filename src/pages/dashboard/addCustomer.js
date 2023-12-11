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
          <div className='p-5 border-2 border-[#D1D1D1] rounded-xl'>
            <img src={BackImage} alt='BackImage'/>
          </div>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	'>Add New Customer</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Dealer </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Add New Customer </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
  
        <form className='mt-8'>
          <Grid>
          <div className='col-span-5'>
            <Select label="Dealer Name *"
              options={country}
              selectedValue={selectedValue}
              onChange={handleSelectChange}/>
          </div>
          </Grid>
          <div className='bg-white p-4 drop-shadow-4xl border-[1px] border-[#D1D1D1] rounded-xl'>
            <Grid>
              <div className='col-span-5 border-e-[1px] border-[#D1D1D1] pr-3'>
                <Grid>
                  <div className='col-span-12'>
                    <Input type='text' name='customerAccountName' label='Customer Account Name *' placeholder='Enter' />
                  </div>
                  <div className='col-span-12'>
                    <div className='flex'>
                      <p className='text-neutral-grey'>Address</p>
                      <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
                    </div>
                  </div>
                  <div className='col-span-12'>
                    <Input type='text' name='customerStreetAddress' label='Customer Street Address *' placeholder='Enter' />
                  </div>
                  <div className='col-span-12'>
                    <Select label="City *"
                    options={city}
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-12'>
                    <Select label="State *"
                    options={city}
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-12'>
                    <Input type='text' name='zipcode' label='Zipcode *' placeholder='Enter' />
                  </div>
                </Grid>
              </div>
              <div className='col-span-7'>
                <p className='text-light-black text-lg mt-3 font-semibold'>Contact Information</p>
                <p className='text-light-black flex text-base font-normal my-3' >Do you want to create an account?       
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
                      <Input type='text' name='fName' label='First Name *' placeholder='Enter' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='lName' label='Last Name *' placeholder='Enter' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='email' name='email' label='Email *' placeholder='Enter' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='phone' label='Phone*' placeholder='Enter' />
                  </div>
                  <div className='col-span-12'>
                      <Input type='text' name='Position' label='Position*' placeholder='Enter' />
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