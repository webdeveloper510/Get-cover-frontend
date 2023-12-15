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
import FileDropdown from '../../../common/fileDropbox';

function UploadDealerBook() {
  const [selectedValue, setSelectedValue] = useState('');
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

  const country = [
    { label: 'Country', value: 'country' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  return (
    <div className='my-8 ml-3'>

      <Headbar />

      <div className='flex mt-14'>
        <div className='pl-3'>
          <p className='font-ExtraBold text-[36px] leading-9 mb-[3px]'>Upload Dealer Book</p>
          <ul className='flex self-center'>
            <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Price Book </Link>  <span className='mx-2'> /</span></li>
            <li className='text-sm text-neutral-grey font-semibold ml-1'> Upload Dealer Book </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}

      <form className='mt-8'>
        <div className='px-8 py-8 drop-shadow-4xl bg-white min-h-screen border-[1px] border-[#D1D1D1]  rounded-xl'>
          <Grid className=''>
            <div className='col-span-6'>
              <Select label="Dealer Name *"
                options={country}
                className="!bg-[#fff]"
                selectedValue={selectedValue}
                onChange={handleSelectChange} />
            </div>
            <div className='col-span-6'>
              <Input type='text' name='Position' className="!bg-[#fff]" label='Email Confirmations' required={true} placeholder='' />
            </div>
            <div className='col-span-12'>
              <p className='text-light-black text-base mb-2 font-semibold'>Upload In Bulk</p>
              <FileDropdown className="!bg-transparent" />
              <p className='text-[10px] mt-1 text-[#5D6E66] font-medium'>Please click on file option and make a copy. Upload the list of Product Name and Price using our provided Google Sheets template, by<span className='underline'>Clicking here </span>. The file must be saved with CSV Format.</p>
            </div>
          </Grid>
          <Button className='mt-12 font-normal rounded-[25px]' onClick={() => { openModal(true); }}>Submit</Button>
        </div>
      </form>

      {/* Modal Email Popop */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button onClick={closeModal} className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-[#5f5f5f]">
          <img src={Cross} className="w-full h-full text-black rounded-full p-0" />
        </Button>
        <div className='text-center py-3'>
          <img src={AddDealer} alt='email Image' className='mx-auto' />
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'>Uploaded & Saved<span className='text-light-black'> Successfully </span></p>
          <p className='text-neutral-grey text-base font-medium mt-2'>You have successfully uploaded & saved the <br /> <b> Dealer Book </b> with the new data <br /> you have entered. </p>
        </div>
      </Modal>
    </div>
  )
}

export default UploadDealerBook