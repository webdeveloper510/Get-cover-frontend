import React, { useState } from 'react'
import Headbar from '../../../common/headBar'
import { Link } from 'react-router-dom'
import Select from '../../../common/select';
import Grid from '../../../common/grid';
import Input from '../../../common/input';

// Media Include
import BackImage from '../../../assets/images/icons/backArrow.svg'
import DeleteImage from '../../../assets/images/icons/Delete.svg'
import AddDealer from '../../../assets/images/dealer-book.svg'
import Button from '../../../common/button';
import RadioButton from '../../../common/radio';
import Modal from '../../../common/model';

function AddOrder() {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedOption, setSelectedOption] = useState('option1');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const handleRadioChange = (event) => {
      setSelectedOption(event.target.value);
    };
    const handleSelectChange1 = (label, value) => {
      setSelectedCity(value);
    };
    
    const handleSelectChange = (label, value) => {
      setSelectedValue(value);
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
        <div className='flex mt-2'>
        <Link to={'/orderList'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
            <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
          </Link>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9 mb-[3px]'>Add Order</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Order </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-Regular'> Add Order / </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'>  Order Details </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
          <div className='flex my-4'>
            <div className='text-center'>
                <p className='border border-black rounded-full mx-auto w-[26px]'>1</p>
                <p className='text-sm font-bold'>Order Details</p>
            </div>
            <hr className='w-[150px] border-black mt-3'/>
            <div className='text-center'>
                <p className='border border-black rounded-full mx-auto w-[26px]'>2</p>
                <p className='text-sm font-bold'>Dealer Order Details</p>
            </div>
            <hr className='w-[150px] border-black mt-3'/>
            <div className='text-center'>
                <p className='border border-black rounded-full mx-auto w-[26px]'>3</p>
                <p className='text-sm font-bold'>Add Product</p>
            </div>
            <hr className='w-[150px] border-black mt-3'/>
            <div className='text-center'>
                <p className='border border-black rounded-full mx-auto w-[26px]'>4</p>
                <p className='text-sm font-bold'>Order Details</p>
            </div>
          </div>
      </div>
    )
  }

export default AddOrder