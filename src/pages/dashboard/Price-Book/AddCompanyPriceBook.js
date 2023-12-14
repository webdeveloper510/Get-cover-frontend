import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Headbar from '../../../common/headBar'
import Select from '../../../common/select';
import Grid from '../../../common/grid';
import Input from '../../../common/input';
import { useFormik } from "formik";
import * as Yup from "yup";

// Media Include
import BackImage from '../../../assets/images/icons/backArrow.svg'
import Button from '../../../common/button';
import Modal from '../../../common/model';
import Cross from '../../../assets/images/Cross.png'
import AddDealer from '../../../assets/images/dealer-book.svg'
import { addCompanyPricBook, getCategoryListActiveData, getTermList } from '../../../services/priceBookService';

function AddCompanyPriceBook() {
  const [error,setError] = useState('')
  const [timer, setTimer] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([])
  const [termList, setTermList] = useState([])
  const [totalAmount, setTotalAmount] = useState();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      priceCatId: '',
      name: '',
      description: '',
      term: '',
      frontingFee: '',
      reinsuranceFee: '',
      reserveFutureFee: '',
      adminFee: '',
      status: '',
    },
    validationSchema: Yup.object({
      priceCatId: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      term: Yup.number().required('Required'),
      frontingFee: Yup.number().required('Required'),
      reinsuranceFee: Yup.number().required('Required'),
      reserveFutureFee: Yup.number().required('Required'),
      adminFee: Yup.number().required('Required'),
      status: Yup.string().required('Rrequired'),
    }),
    onSubmit: async (values) => {
       console.log("Form values:", values);
      const result = await addCompanyPricBook(values);
      console.log(result);
      if (result.code !== 200) {
        setError(result.message);
      } else {
         setError(false);
         setIsModalOpen(true)
         setTimer(3)
      }
    },

  });
  const calculateTotal = () => {
    const frontingFee = parseFloat(formik.values.frontingFee) || 0;
    const reinsuranceFee = parseFloat(formik.values.reinsuranceFee) || 0;
    const reserveFutureFee = parseFloat(formik.values.reserveFutureFee) || 0;
    const adminFee = parseFloat(formik.values.adminFee) || 0;

    const total = frontingFee + reinsuranceFee + reserveFutureFee + adminFee;
    setTotalAmount(total);
  };

  useEffect(() => {
    calculateTotal(); 
  }, [formik.values]);


  useEffect(() => {
    let intervalId;
    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeModal();
      navigate('/companyPriceBook')
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen, timer]);

  useEffect(() => {
    getCategoryListActiveData11()
    getTermListData()
  }, [])

  const getTermListData = async () => {
    try {
      const res = await getTermList();
      console.log(res.result.terms)
      setTermList(res.result.terms.map((item) => ({
        label: item.terms + ' Months',
        value: item.terms,
      })));
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  }

  const getCategoryListActiveData11 = async () => {
    try {
      const res = await getCategoryListActiveData();
      console.log("hello",res)
      setCategoryList(res.result.map((item) => ({
        label: item.name,
        value: item._id,
      })));
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };



  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSelectChange = (name, selectedValue) => {
    formik.setFieldValue(name, selectedValue);
  };

  const status = [
    { label: 'Active', value: true },
    { label: 'InActive', value: false },
  ];

  return (
    <div className='my-8 ml-3'>
      <Headbar />
      <div className='flex mt-14'>
        <Link to={'/companyPriceBook'} className='h-[60px] w-[60px] flex border-[1px] bg-[#fff] border-[#D1D1D1] rounded-[25px]'>
          <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage' /> </Link>
        <div className='pl-3'>
          <p className='font-ExtraBold text-[38px] leading-9 mb-[3px]'>Add Company Price Book</p>
          <ul className='flex self-center'>
            <li className='text-sm text-neutral-grey font-Regular'><Link to={'/dashboard'}>Price Book </Link>  <span className='mx-2'> /</span>  </li>
            <li className='text-sm text-neutral-grey font-Regular ml-1'><Link to={'/companyPriceBook'} className='text-sm text-neutral-grey font-Regular'>Company Price Book </Link>  <span className='mx-2'> /</span>  </li>
            <li className='text-sm text-neutral-grey font-semibold ml-1'> Add Company Price Book </li>
          </ul>
        </div>
      </div>

         {error && (
                  <p className="text-red-500 text-sm pl-2">
                    <span className="font-semibold"> {error} </span>
                  </p>
                )}

      <form className='mt-8' onSubmit={formik.handleSubmit}>
        <div className='px-8 py-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl'>
          <Grid className='!grid-cols-5'>
            <div className='col-span-1'>
              <Select
                label="Product Category*"
                name="priceCatId"
                placeholder=""
                onChange={handleSelectChange}
                className='!bg-[#fff]'
                options={categoryList}
                value={formik.values.priceCatId}
                onBlur={formik.handleBlur}
                error={formik.touched.priceCatId && formik.errors.priceCatId}
              />
              {formik.touched.priceCatId && formik.errors.priceCatId && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.priceCatId}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Input
                type='text'
                name='name'
                className='!bg-[#fff]'
                label='Product Name '
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.name}
                </div>
              )}
            </div>
            <div className='col-span-2'>
              <Input
                type='text'
                name='description'
                className='!bg-[#fff]'
                label='Description '
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.description}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Select
                label="Terms*"
                name="term"
                placeholder=""
                onChange={handleSelectChange}
                className='!bg-[#fff]'
                options={termList}
                value={formik.values.term}
                onBlur={formik.handleBlur}
                error={formik.touched.term && formik.errors.term}
              />
              {formik.touched.term && formik.errors.term && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.term}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Input
                type='number'
                name='frontingFee'
                className='!bg-[#fff]'
                label='Fronting fee '
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.frontingFee}
                maxDecimalPlaces={2}
              />
              {formik.touched.frontingFee && formik.errors.frontingFee && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.frontingFee}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Input
                type='number'
                name='reinsuranceFee'
                className='!bg-[#fff]'
                label='Re-insurance fee '
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reinsuranceFee}
                maxDecimalPlaces={2}
              />
              {formik.touched.reinsuranceFee && formik.errors.reinsuranceFee && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.reinsuranceFee}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Input
                type='number'
                name='reserveFutureFee'
                className='!bg-[#fff] !px-0 w-[200px]'
                label='Reserve for future claims'
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.reserveFutureFee}
                maxDecimalPlaces={2}
              />
              {formik.touched.reserveFutureFee && formik.errors.reserveFutureFee && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.reserveFutureFee}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Input
                type='number'
                name='adminFee'
                className='!bg-[#fff]'
                label='Administration fee '
                placeholder=''
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.adminFee}
                maxDecimalPlaces={2}
              />

              {formik.touched.adminFee && formik.errors.adminFee && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.adminFee}
                </div>
              )}
            </div>
            <div className='col-span-1'>
              <Select
                label="Status*"
                name="status"
                placeholder=""
                onChange={handleSelectChange}
                className='!bg-[#fff]'
                options={status}
                value={formik.values.status}
                onBlur={formik.handleBlur}
                error={formik.touched.status && formik.errors.status}
                defaultValue={status.find(option => option.value === true)}
              />
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm pl-2 pt-2">
                  {formik.errors.status}
                </div>
              )}
            </div>
          </Grid>
          <p className='mt-8 font-semibold text-lg'>Total Amount:  <span> ${totalAmount}</span></p>
          <Button type='submit' className='mt-12 font-normal rounded-[25px]' >Submit</Button>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='text-center py-3'>
          <img src={AddDealer} alt='email Image' className='mx-auto' />
          <p className='text-3xl mb-0 mt-4 font-semibold text-neutral-grey'>Submitted <span className='text-light-black'> Successfully </span></p>
          <p className='text-neutral-grey text-base font-medium mt-2'><b> Company Price Book </b> added successfully. </p>
          <p className='text-neutral-grey text-base font-medium mt-2'>
           Redirecting you on Company Price Book Page {timer} seconds.
          </p>
        </div>

      </Modal>
    </div>
  )
}

export default AddCompanyPriceBook