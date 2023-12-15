import React, { useState } from 'react'
import Headbar from '../../../common/headBar'
import { Link } from 'react-router-dom'
import Select from '../../../common/select';
import Grid from '../../../common/grid';
import Input from '../../../common/input';

// Media Include
import BackImage from '../../../assets/images/icons/backArrow.svg'
import DeleteImage from '../../../assets/images/icons/Delete.svg'
import Button from '../../../common/button';
import RadioButton from '../../../common/radio';

function AddServicer() {
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
        <div className='flex mt-14'>
        <Link to={'/servicerList'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
            <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
          </Link>
          <div className='pl-3'>
            <p className='font-semibold text-[36px] leading-9 mb-[3px]'>Add Servicer</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Servicer </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Add Servicer </li>
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
              <div className='col-span-4 border-e-[1px] border-[#D1D1D1] pr-3'>
              <p className='text-light-black text-lg font-semibold'>Create Account</p>
                <Grid>
                  <div className='col-span-12 mt-4'>
                    <Input type='text' name='servicerAccountName' className='!bg-white' required={true} label='Servicer Account Name' placeholder=''  />
                  </div>
                  <div className='col-span-12'>
                    <div className='flex'>
                      <p className='text-neutral-grey'>Address</p>
                      <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
                    </div>
                  </div>
                  <div className='col-span-12'>
                    <Input type='text' name='customerStreetAddress' className='!bg-white' required={true} label='Servicer Street Address' placeholder='' />
                  </div>
                  <div className='col-span-12'>
                    <Select label="Servicer City"
                    required={true}
                    options={city}
                    className='!bg-white'
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-12'>
                    <Select label="Servicer State"
                    options={city}
                    className='!bg-white'
                    required={true}
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-12'>
                    <Input type='text' name='zipcode' className='!bg-white' label='Servicer Zipcode' required={true} placeholder='' />
                  </div>
                </Grid>
              </div>
              <div className='col-span-8'>
                <p className='text-light-black text-lg font-semibold'>Contact Information</p>
                <p className='text-light-black flex text-[12px]  font-semibold mt-3 mb-6' >Do you want to create an account?       
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
                      <Input type='text' name='fName' className='!bg-white' required={true} label='First Name' placeholder='' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='lName' className='!bg-white' label='Last Name' required={true} placeholder='' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='email' name='email' className='!bg-white' label='Email' required={true} placeholder='' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='phone' className='!bg-white' label='Phone' required={true} placeholder='' />
                  </div>
                  <div className='col-span-6'>
                      <Input type='text' name='Position' className='!bg-white' label='Position' required={true} placeholder=''/>
                  </div>
                  <div className='col-span-6'>
                  <p className='text-light-black flex text-[12px]  font-semibold mt-3 mb-6' > Do you want to create an account?       
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
                  </div>
                </Grid>

                <div className='mt-8'>
                   <Grid>
                    <div className='col-span-4'>
                      <Button className='text-sm !font-light w-full'>+  Add More Team Members</Button>
                    </div>
                    <div className='col-span-8 self-center'>
                      <hr/>
                    </div>
                   </Grid>
                </div>
              </div>
            </Grid>
          </div>

          <div className="bg-white p-8 relative drop-shadow-4xl mt-8 rounded-xl">
          <p className="text-light-black text-lg mb-6 font-semibold">
          Add Dealer’s Team Members
          </p>
          <div className="">
            <Grid className="">
              <div className='col-span-11'>
                <Grid className='pr-12 pl-4'>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerAccountName"
                    label="First Name"
                    className='!bg-white'
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerStreetAddress"
                    className='!bg-white'
                    label="Last Name"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerAccountName"
                    className='!bg-white'
                    label="Email"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerStreetAddress"
                    className='!bg-white'
                    label="Phone"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerAccountName"
                    className='!bg-white'
                    label="Position"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-4'>
                  <p className='text-light-black flex text-[12px]  font-semibold mt-3 mb-6' > Do you want to create an account?       
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
                  </div>
                </Grid>
              </div>
              <div className='col-span-1'>
                <div className='flex h-full bg-[#EBEBEB] justify-center'>
                  <img src={DeleteImage} className='self-center cursor-pointer' alt='Delete Icon'/>
                </div>
              </div>
            </Grid>
          </div>
        </div>
  
          <Button className='mt-8' >Submit</Button>
        </form>
      </div>
    )
}

export default AddServicer