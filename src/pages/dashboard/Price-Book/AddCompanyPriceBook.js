import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Headbar from '../../../common/headBar'
import Select from '../../../common/select';
import Grid from '../../../common/grid';
import Input from '../../../common/input';

// Media Include
import BackImage from '../../../assets/images/icons/backArrow.svg'
import Button from '../../../common/button';
import Modal from '../../../common/model';
import Cross from '../../../assets/images/Cross.png'
import AddDealer from '../../../assets/images/dealer-book.svg'

function AddCompanyPriceBook() {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const handleSelectChange = (name , value) => {
      setSelectedValue(value);
    };
    const handleSelectChange1 = (name, value) => {
      setSelectedProduct(value);
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
        <Link to={'/companyPriceBook'} className='h-[60px] w-[60px] flex border-[1px] bg-[#fff] border-[#D1D1D1] rounded-[20px]'>
          <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/> </Link>
          <div className='pl-3'>
            <p className='font-ExtraBold text-[38px] leading-9 mb-[3px]'>Add Company Price Book</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/dashboard'}>Price Book </Link>  <span className='mx-2'> /</span>  </li>
              <li className='text-sm text-neutral-grey font-Regular ml-1'><Link to={'/companyPriceBook'} className='text-sm text-neutral-grey font-Regular'>Company Price Book </Link>  <span className='mx-2'> /</span>  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-1'> Add Company Price Book </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
  
        <form className='mt-8'>
          <div className='px-8 py-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl'>
          <Grid className='!grid-cols-5'>
                  <div className='col-span-1'>
                       <Select label="Product Category "
                        options={country}
                        required={true}
                        className="!bg-[#fff]"
                        selectedValue={selectedValue}
                        onChange={handleSelectChange}/>
                  </div>
                  <div className='col-span-1'>
                  <Input type='text' name='Position' className="!bg-[#fff]" label='Product Name ' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-2'>
                  <Input type='text' name='Position' className="!bg-[#fff]" label='Description ' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-1'>
                  <Select label="Terms"
                        options={city}
                        required={true}
                        className="!bg-[#fff]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-1'>
                      <Input type='number' name='Position' className="!bg-[#fff]" label='Fronting fee ' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-1'>
                  <Input type='number' name='Position' className="!bg-[#fff]" label='Re-insurance fee ' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-1'>
                      <Input type='number' name='Retail' className="!bg-[#fff] w-[110%]" label='Reserve for future claims' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-1'>
                      <Input type='number' name='Retail' className="!bg-[#fff]" label='Administration fee' required={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-1'>
                      <Select label="Status"
                        options={city}
                        required={true}
                        className="!bg-[#fff]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                </Grid>
                <p className='mt-8 font-semibold text-lg'>Total Amount:  <span> $100 </span></p>
                <Button className='mt-12 font-normal rounded-[25px]' onClick={() => {openModal(true);}}>Submit</Button>
          </div>
        </form>

          {/* Modal Email Popop */}
       <Modal isOpen={isModalOpen} onClose={closeModal}>
       {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button> */}
        <div className='text-center py-3'>
          <img src={AddDealer} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'>Submited  <span className='text-light-black'> Successfully </span></p>
          <p className='text-neutral-grey text-base font-medium mt-2'><b> Company Price Book </b> added successfully. </p>
          <p className='text-neutral-grey text-base font-medium mt-2'>Redirect to Company Price  Book Page In <span>5</span> Seconds </p>
        </div>
        
      </Modal>
      </div>
    )
  }

export default AddCompanyPriceBook