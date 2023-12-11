import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import Button from '../../../common/button'


import AddItem from '../../../assets/images/icons/addItem.svg';
import Search from '../../../assets/images/icons/SearchIcon.svg';
import Headbar from '../../../common/headBar';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import Select from '../../../common/select';
function DealerList() {
    const [selectedProduct, setSelectedProduct] = useState('');
    const handleSelectChange1 = (e) => {
        setSelectedProduct(e.target.value);
      };
    
      const country = [
        { label: 'Country', value: 'country' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
      ];
  return (
    <>
     <div className='my-8 ml-3'>
        <Headbar/>
        <div className='flex'>
          <div className='pl-3'>
            <p className='font-bold text-[38px] leading-9	mb-[3px]'>Dealer Book</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Price Book </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Dealer Book </li>
            </ul>
          </div>
        </div>
        <Button  className="!bg-white flex self-center mb-4 rounded-xl ml-auto border-[1px] border-[#D1D1D1]" > <Link to={'/add-Dealer-Book'} className='flex'> <img src={AddItem} className='self-center' alt='AddItem' /> <span className='text-black ml-3 font-medium'>Add Dealer Book </span>  </Link></Button>

        <div className='bg-white p-[26px] border-[1px] border-[#D1D1D1] rounded-xl'>
          <Grid>
            <div className='col-span-5 self-center'>
               <p className='text-xl font-semibold'>Dealer Price List</p>
            </div>
            <div className='col-span-7'>
               <div className='bg-[#F9F9F9] rounded-[30px] p-3 border-[1px] border-[#D1D1D1]'>
                <Grid className='!grid-cols-9' >
                  <div className='col-span-2 self-center'>
                  <Input name='Category' type='text' className1="!pt-2 !pb-0" label='Category' />
                  </div>
                  <div className='col-span-2 self-center'>
                  <Input name='Name' type='text' className1="!pt-2 !pb-0" label='Name' />
                  </div>
                  <div className='col-span-2 self-center'>
                  <Select label="Term"
                        options={country}
                        className1="!pt-2 !pb-0"
                        className="!bg-[#f7f7f7]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-2 self-center'>
                  <Select label="Status"
                        options={country}
                        className1="!pt-2 !pb-0"
                        className="!bg-[#f7f7f7]"
                        selectedValue={selectedProduct}
                        onChange={handleSelectChange1}/>
                  </div>
                  <div className='col-span-1 self-center'>
                    <img src={Search} alt='Search' />
                  </div>
                </Grid>
                  
               </div>
            </div>
          </Grid>
        </div>
     </div>
    </>
  )
}

export default DealerList