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
import Wholesale  from '../../../assets/images/icons/wholePrice.svg';
import product  from '../../../assets/images/icons/productName.svg';
import category  from '../../../assets/images/icons/productCat.svg';
import dealer  from '../../../assets/images/icons/dealerName.svg';
import AddDealer from '../../../assets/images/dealer-book.svg'

function AddDealerBook() {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const handleSelectChange = (label, value) => {
      setSelectedValue(value);
    };
    const handleSelectChange1 = (label, value) => {
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

    const status = [
      { label: 'Active', value: true },
      { label: 'Inactive', value: false },
    ];
  
    return (
      <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex'>
        <Link to={'/dealerList'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[20px]'>
           <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/></Link>
          <div className='pl-3'>
            <p className='font-semibold text-[36px] leading-9 mb-[3px]'>Add Dealer Book</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/dashboard'}>Price Book </Link>  <span className='mx-2'> /</span>  </li>
              <li className='text-sm text-neutral-grey font-Regular ml-1'><Link to={'/dealerList'} className='text-sm text-neutral-grey font-Regular'>Dealer Book </Link>  <span className='mx-2'> /</span>  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-1'> Add Dealer Book </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
  
        <form className='mt-8'>
          <div className='px-8 py-8 drop-shadow-4xl bg-white  border-[1px] border-[#D1D1D1]  rounded-3xl'>
          <Grid>
                  <div className='col-span-4'>
                       <Select label="Dealer Name"
                        options={country}
                        className="!bg-[#fff]"
                        required={true}
                        selectedValue={selectedValue}
                        onChange={handleSelectChange}/>
                  </div>
                  <div className='col-span-4'>
                      <Input type='text' name='lName' className="!bg-[#fff]" label='Product Category' placeholder='' required={true} />
                  </div>
                  <div className='col-span-4'>
                  <Select label="Product Name *"
                        options={city}
                        className="!bg-[#fff]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-4'>
                      <Input type='number' name='phone' className="!bg-[#fff]" label='Wholesale Price ($) ' required={true} placeholder='' />
                  </div>
                  <div className='col-span-4'>
                      <Input type='text' name='Position' className="!bg-[#fff]" label='Description ' required={true} placeholder='' />
                  </div>
                  <div className='col-span-4'>
                  <Select label="Product Name"
                        options={city}
                        required={true}
                        className="!bg-[#fff]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-4'>
                      <Input type='number' name='Retail' className="!bg-[#fff]" label='Retail Price($) ' required={true} placeholder='' />
                  </div>
                  <div className='col-span-4'>
                      <Select label="Status"
                        options={status}
                        required={true}
                        className="!bg-[#fff]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                </Grid>
                <Button className='mt-12 font-normal rounded-[25px]' onClick={() => {openModal(true);}}>Submit</Button>
          </div>
        </form>

          {/* Edit Form  */}
        <div>
          <div className='bg-Edit bg-cover px-4 mt-8 py-16 rounded-[30px]'>
             <Grid className='mx-8 mx-auto '>
              <div className='col-span-3 self-center border-r border-[#4e4e4e]'>
                <div className='flex'>
                  <div className='self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4'>
                    <img src={Wholesale} className='w-6 h-6' alt='Wholesale'/>
                  </div>
                  <div className='self-center'>
                    <p className='text-[#FFF] text-lg font-medium leading-5	'>Wholesale Price($)</p>
                    <p className='text-[#FFFFFF] opacity-50	font-medium'>121.86</p>
                  </div>
                </div>
              </div>
              <div className='col-span-3 border-r border-[#4e4e4e]'>
              <div className='flex'>
              <div className='self-center bg-[#FFFFFF08] backdrop-blur border-[#D1D9E24D] border rounded-lg p-3 mr-4'>
                    <img src={category} className='w-6 h-6' alt='category'/>
                  </div>
                  <div className='self-center'>
                    <p className='text-[#FFF] text-lg font-medium leading-5	'>Product Category</p>
                    <p className='text-[#FFFFFF] opacity-50	font-medium'>Appliance</p>
                  </div>
                </div>
              </div>
              <div className='col-span-3 border-r border-[#4e4e4e]'>
              <div className='flex'>
              <div className='self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4'>
                    <img src={dealer} className='w-6 h-6' alt='dealer'/>
                  </div>
                  <div className='self-center'>
                    <p className='text-[#FFF] text-lg font-medium leading-5	'>Dealer Name</p>
                    <p className='text-[#FFFFFF] opacity-50	font-medium'>Ankush</p>
                  </div>
                </div>
              </div>
              <div className='col-span-3'>
              <div className='flex'>
                  <div className='self-center bg-[#FFFFFF08] border-[#D1D9E24D] border rounded-lg p-3 mr-4'>
                    <img src={product} className='w-6 h-6' alt='product'/>
                  </div>
                  <div className='self-center'>
                    <p className='text-[#FFF] text-lg font-medium leading-5	'>Product Name</p>
                    <p className='text-[#FFFFFF] opacity-50	font-medium'>MC-100662</p>
                  </div>
                </div>
              </div>
             </Grid>
          </div>

          <Grid className='mt-8'>
                  <div className='col-span-4'>
                      <Input type='number' name='Retail' label='Retail Price($) ' required={true} placeholder='' />
                  </div>
                  <div className='col-span-4'>
                      <Select label="Status"
                        options={status}
                        required={true}
                        // className="!bg-[#fff]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
          </Grid>
          <div className='mt-8'>
            <Button className='mr-3 '>Update</Button>
            <Button className='bg-[transparent] !text-light-black'>Cancel</Button>
          </div>
        </div>

          {/* Modal Email Popop */}
          <Modal isOpen={isModalOpen} onClose={closeModal}>
          {/* <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
              <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
            </Button> */}
            <div className='text-center py-3'>
              <img src={AddDealer} alt='email Image' className='mx-auto'/>
              <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'>Submitted <span className='text-light-black'> Successfully </span></p>
              <p className='text-neutral-grey text-base font-medium mt-2'><b> New Dealer Book </b> added successfully. </p>

            </div>
            
          </Modal>
      </div>
    )
  }

export default AddDealerBook