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

function AddCategory() {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const handleSelectChange = (e) => {
      setSelectedValue(e.target.value);
    };
    const handleSelectChange1 = (e) => {
      setSelectedProduct(e.target.value);
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
          <div className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
            <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
          </div>
          <div className='pl-3'>
            <p className='font-ExtraBold text-[38px] leading-9 mb-[3px]'>Add New Category</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Price Book </Link>  <span className='mx-2'> /</span>  </li>
              <li className='text-sm text-neutral-grey font-Regular ml-1'><Link to={'/'} className='text-sm text-neutral-grey font-Regular'>Category </Link>  <span className='mx-2'> /</span>  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-1'> Add New Category </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
  
        <form className='mt-8'>
          <div className='px-8 py-8 drop-shadow-4xl bg-white min-h-screen border-[1px] border-[#D1D1D1]  rounded-xl'>
          <Grid>
                  <div className='col-span-12'>
                      <Input type='text' name='lName' className="!bg-[#fff]" label='Category Name'  required ={true} placeholder='Enter' />
                  </div>
                  <div className='col-span-12'>
                    <div className='relative'>
                     <label for="message" class="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75">Description *</label>
                     <textarea id="message" rows="4" class="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 peer " placeholder="Type here..."></textarea>
                    </div>
                  </div>
                </Grid>
                <Button className='mt-12 font-normal' onClick={() => {openModal(true);}}>Submit</Button>
          </div>
        </form>

          {/* Modal Email Popop */}
       <Modal isOpen={isModalOpen} onClose={closeModal}>
       <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button>
        <div className='text-center py-3'>
          <img src={AddDealer} alt='email Image' className='mx-auto'/>
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'>Summited  <span className='text-light-black'> Successfully </span></p>
          <p className='text-neutral-grey text-base font-medium mt-2'><b> New category </b>  will be added successfully. </p>
        </div>
        
      </Modal>
      </div>
    )
  }

export default AddCategory