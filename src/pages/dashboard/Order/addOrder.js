import React, { useEffect, useState } from 'react'
import Headbar from '../../../common/headBar'
import { Link } from 'react-router-dom'
import Select from '../../../common/select';
import Grid from '../../../common/grid';
import Input from '../../../common/input';

// Media Include
import BackImage from '../../../assets/images/icons/backArrow.svg'
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import Delete from "../../../assets/images/icons/DeleteIcon.svg";
import check from "../../../assets/images/icons/check.svg";
import Button from '../../../common/button';
import { useFormik } from "formik";
import * as Yup from "yup";
import { getDealersList } from '../../../services/dealerServices';
import { getServicerListByDealerId } from '../../../services/servicerServices';
import { getCustomerListByDealerId } from '../../../services/customerServices';


function AddOrder() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOption, setSelectedOption] = useState('option1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dealerList, setDealerList] = useState([]);
  const [servicerData, setServicerData] = useState([]);
  const [customerList, setCustomerList] = useState([]);



  console.log(currentStep)
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getDealerListData = async () => {
    const result = await getDealersList();
    console.log(result.data);
    let arr = [];
    const filteredDealers = result.data.filter(
      (data) => data.dealerData.accountStatus === true
    );
    filteredDealers?.map((res) => {
      console.log(res.name);
      arr.push({
        label: res.dealerData.name,
        value: res.dealerData._id,
      });
    });
    setDealerList(arr);
  };

  const getServicerList = async (id) => {
    let arr = [];
    const result = await getServicerListByDealerId(id);
    const filteredServicers = result.data.filter(
      (data) => data.servicerData.status === true
    );
    filteredServicers?.map((res) => {
      console.log(res);
      arr.push({
        label: res.servicerData.name,
        value: res.servicerData._id,
      });
    });
    setServicerData(arr);

  };

  const getCustomerList = async (id) => {
    let arr = [];
    const result = await getCustomerListByDealerId(id, {});
    result?.result?.map((res) => {
      console.log(res);
      arr.push({
        label: res.customerData.username,
        value: res.customerData._id,
      });
    });
    setCustomerList(arr)
  };
  useEffect(() => {
    getDealerListData()
  }, [])
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };
  const formik = useFormik({
    initialValues: {
      dealerName: "",
      servicerName: "",
      customerName: "",
    },
    validationSchema: Yup.object().shape({
      dealerName: Yup.string().required("Dealer Name is required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      nextStep()
    },
  });

  const formikStep2 = useFormik({
    initialValues: {
      dealerPurchaseOrder: "",
      serviceCoverageType: "",
      coverageType: "",
    },
    validationSchema: Yup.object().shape({
      dealerPurchaseOrder: Yup.string().required("Dealer Purchase Order is Required"),
      serviceCoverageType: Yup.string().required("Service Coverage Type is Required"),
      coverageType: Yup.string().required("Coverage Type is Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      nextStep()
    },
  });
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSelectChange1 = (name, value) => {
    formikStep2.setFieldValue(name,value)
  };

  const handleSelectChange = (name, value) => {
    formik.setFieldValue(name, value)
    if (name == "dealerName") {
      formik.setFieldValue('servicerName', '')
      formik.setFieldValue('customerName', '')
      getServicerList(value)
      getCustomerList(value)
    }
  };
  const country = [
    { label: 'Country', value: 'country' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
  const coverage = [
    { label: 'Parts', value: 'Parts' },
    { label: 'Labour', value: 'Labour' },
    { label: 'Parts/Labour', value: 'Parts/Labour' },
  ];

  const renderStep1 = () => {
    // Step 1 content
    return (
      <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl'>
        <p className='text-2xl font-bold mb-4'>Order Details</p>
        <Grid>
          <div className='col-span-6'>
            <Grid>
              <div className='col-span-6'>
                <Select
                  label="Dealer Name"
                  name="dealerName"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  onChange={handleSelectChange}
                  options={dealerList}
                  value={formik.values.dealerName}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dealerName && formik.errors.dealerName}
                />
                {formik.touched.dealerName && formik.errors.dealerName && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formik.errors.dealerName}
                  </div>
                )}
              </div>
              <div className='col-span-6'>
                <Select
                  label="Servicer Name"
                  name="servicerName"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  onChange={handleSelectChange}
                  options={servicerData}
                  value={formik.values.servicerName}
                  onBlur={formik.handleBlur}
                  error={formik.touched.servicerName && formik.errors.servicerName}
                />
              </div>
              <div className='col-span-12'>
                <Select
                  label="Customer Name"
                  name="customerName"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  onChange={handleSelectChange}
                  options={customerList}
                  value={formik.values.customerName}
                  onBlur={formik.handleBlur}
                  error={formik.touched.customerName && formik.errors.customerName}
                />

              </div>
            </Grid>
          </div>
          <div className='col-span-6 self-end justify-end flex'>
            <Button onClick={formik.handleSubmit}>Next</Button>
          </div>
        </Grid>
      </div>
    );
  };

  const renderStep2 = () => {
    // Step 2 content
    return (
      <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl'>
        <p className='text-2xl font-bold mb-4'>Dealer Order Details</p>
        <Grid>
          <div className='col-span-6'>
            <Grid>
              <div className='col-span-12'>
      
                            
                  <div className="col-span-12 mt-4">
                    <Input
                      type="text"
                      name="dealerPurchaseOrder"
                      className="!bg-white"
                      label="Dealer Purchase Order"
                      required={true}
                      placeholder=""
                      maxLength={"500"}
                      value={formikStep2.values.dealerPurchaseOrder}
                      onBlur={formikStep2.handleBlur}
                      onChange={formikStep2.handleChange}
                      error={
                        formikStep2.touched.dealerPurchaseOrder && formikStep2.errors.dealerPurchaseOrder
                      }
                    />
                    {formikStep2.touched.dealerPurchaseOrder &&
                      formikStep2.errors.dealerPurchaseOrder && (
                        <div className="text-red-500 text-sm pl-2 pt-2">
                          {formikStep2.errors.dealerPurchaseOrder}
                        </div>
                      )}
                
                </div>
              </div>
               <div className='col-span-6'>
                <Select
                  label="Service Coverage"
                  name="serviceCoverageType"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  onChange={handleSelectChange1}
                  options={coverage}
                  value={formikStep2.values.serviceCoverageType}
                  onBlur={formikStep2.handleBlur}
                  error={formikStep2.touched.serviceCoverageType && formikStep2.errors.serviceCoverageType}
                />
                {formikStep2.touched.serviceCoverageType && formikStep2.errors.serviceCoverageType && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formikStep2.errors.serviceCoverageType}
                  </div>
                )}
              </div>
                   <div className='col-span-6'>
                <Select
                  label="Coverage Type"
                  name="coverageType"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                  onChange={handleSelectChange1}
                  options={coverage}
                  value={formikStep2.values.coverageType}
                  onBlur={formikStep2.handleBlur}
                  error={formikStep2.touched.coverageType && formikStep2.errors.coverageType}
                />
                {formikStep2.touched.coverageType && formikStep2.errors.coverageType && (
                  <div className="text-red-500 text-sm pl-2 pt-2">
                    {formikStep2.errors.coverageType}
                  </div>
                )}
              </div>
            </Grid>
          </div>
          <div className='col-span-6 self-end justify-end flex'>
            <Button onClick={prevStep} className='!bg-white !text-black'>Previous</Button>
            <Button onClick={formikStep2.handleSubmit}>Next</Button>
          </div>
        </Grid>
      </div>
    );
  };

  const renderStep3 = () => {
    // Step 3 content
    return (
      <div className='mb-3'>
        <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl relative'>
          <p className='text-2xl font-bold mb-4'>Add Product</p>
          <div className='absolute -right-3 -top-3 bg-gradient-to-r from-[#dbdbdb] to-[#e7e7e7] rounded-xl p-3 '>
            <Button>+ Add More Product</Button>
          </div>
          <Grid>
            <div className='col-span-8 border-r pr-5'>
              <Grid>
                <div className='col-span-6'>
                  <Select
                    label="Product Category"
                    name="productCategory"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={country}
                  />
                </div>
                <div className='col-span-6'>
                  <Select
                    label="Product Name"
                    name="productName"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={city}
                  />
                </div>
                <div className='col-span-12'>
                  <Select
                    label="Product Description"
                    name="productDescription"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={country}
                  />
                </div>
                <div className='col-span-3'>
                  <Select
                    label="Term"
                    name="term"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={city}
                  />
                </div>
                <div className='col-span-3'>
                  <Input
                    type="number"
                    name="unitPrice"
                    className="!bg-white"
                    label="Unit Price"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-3'>
                  <Input
                    type="number"
                    name="productNumber"
                    className="!bg-white"
                    label="# of Products"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-3'>
                  <Input
                    type="number"
                    name="price"
                    className="!bg-white"
                    label="Price "
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-12'>
                  <div className="relative">
                    <label
                      htmlFor="description"
                      className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                    >
                      Note
                    </label>
                    <textarea
                      id="note"
                      rows="4"
                      name="Note"
                      maxLength={150}
                      className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                    ></textarea>
                  </div>
                </div>
              </Grid>
            </div>
            <div className='col-span-4'>
              <div className='border border-dashed w-full h-full relative flex'>
                <label
                  htmlFor="description"
                  className="absolute z-[999] text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                >
                  Upload File
                </label>
                <div className='self-center text-center'>
                  <img src={Dropbox} className="mx-auto mb-3" alt="Dropbox" />
                  <p className="text-[#5D6E66] text-sm">
                    Accepted file types: csv, xls, xlsx Max. file size: 50 MB.
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </div>
        {/* Next Open  */}
        <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl relative'>
          <p className='text-2xl font-bold mb-4'>Add Product</p>
          <div className='absolute -right-3 -top-3 bg-gradient-to-r from-[#dbdbdb] to-[#e7e7e7] rounded-xl p-3 '>
            <img src={Delete} className='cursor-pointer' />
          </div>
          <Grid>
            <div className='col-span-8 border-r pr-5'>
              <Grid>
                <div className='col-span-6'>
                  <Select
                    label="Product Category"
                    name="productCategory"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={country}
                  />
                </div>
                <div className='col-span-6'>
                  <Select
                    label="Product Name"
                    name="productName"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={city}
                  />
                </div>
                <div className='col-span-12'>
                  <Select
                    label="Product Description"
                    name="productDescription"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={country}
                  />
                </div>
                <div className='col-span-3'>
                  <Select
                    label="Term"
                    name="term"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    // options={city}
                  />
                </div>
                <div className='col-span-3'>
                  <Input
                    type="number"
                    name="unitPrice"
                    className="!bg-white"
                    label="Unit Price"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-3'>
                  <Input
                    type="number"
                    name="productNumber"
                    className="!bg-white"
                    label="# of Products"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-3'>
                  <Input
                    type="number"
                    name="price"
                    className="!bg-white"
                    label="Price "
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-12'>
                  <div className="relative">
                    <label
                      htmlFor="description"
                      className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                    >
                      Note
                    </label>
                    <textarea
                      id="note"
                      rows="4"
                      name="Note"
                      maxLength={150}
                      className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer"
                    ></textarea>
                  </div>
                </div>
              </Grid>
            </div>
            <div className='col-span-4'>
              <div className='border border-dashed w-full h-full relative flex'>
                <label
                  htmlFor="description"
                  className="absolute z-[999] text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-[#fff] left-2 px-1 -translate-y-4 scale-75"
                >
                  Upload File
                </label>
                <div className='self-center text-center'>
                  <img src={Dropbox} className="mx-auto mb-3" alt="Dropbox" />
                  <p className="text-[#5D6E66] text-sm">
                    Accepted file types: csv, xls, xlsx Max. file size: 50 MB.
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </div>
        <Button className='!bg-white !text-black' onClick={prevStep}>Previous</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    );
  };

  const renderStep4 = () => {
    // Step 4 content
    return (
      <>
        <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-[#D1D1D1]  rounded-xl'>
          <Grid>
            <div className='col-span-6'>
              <p className='text-2xl font-bold text-[#bbbbbc] mb-4'>Order Details</p>
              <Grid className='bg-[#F9F9F9] border-[#D1D1D1] border rounded-xl px-4 '>
                <div className='col-span-4 py-4 border-r'>
                  <p className='text-[12px]'>Dealer Name</p>
                  <p className='font-bold text-sm'>Edward Wilson</p>
                </div>
                <div className='col-span-4 py-4 border-r'>
                  <p className='text-[12px]'>Servicer Name</p>
                  <p className='font-bold text-sm'>Jameson Wills</p>
                </div>
                <div className='col-span-4 py-4'>
                  <p className='text-[12px]'>Customer Name</p>
                  <p className='font-bold text-sm'>Ankush Grover</p>
                </div>
              </Grid>
            </div>
            <div className='col-span-6'>
              <p className='text-2xl font-bold text-[#bbbbbc] mb-4'>Dealer Order Details</p>
              <Grid className='bg-[#F9F9F9] border-[#D1D1D1] border rounded-xl px-4 '>
                <div className='col-span-4 py-4 border-r'>
                  <p className='text-[12px]'>Dealer Purchase Order</p>
                  <p className='font-bold text-sm'>123456789009876</p>
                </div>
                <div className='col-span-4 py-4 border-r'>
                  <p className='text-[12px]'>Service Coverage</p>
                  <p className='font-bold text-sm'>Parts</p>
                </div>
                <div className='col-span-4 py-4'>
                  <p className='text-[12px]'>Coverage Type</p>
                  <p className='font-bold text-sm'>Breakdown (BD)</p>
                </div>
              </Grid>
            </div>
            <div className='col-span-8'>
              <p className='text-2xl font-bold text-[#bbbbbc] mb-4'>Product Details</p>
              <div className='bg-[#F9F9F9] border-[#D1D1D1] border rounded-xl '>
                <Grid className='border-b px-4'>
                  <div className='col-span-4 py-4 border-r'>
                    <p className='text-[12px]'>Product Category</p>
                    <p className='font-bold text-sm'>Electronic Gadget</p>
                  </div>
                  <div className='col-span-4 py-4 border-r'>
                    <p className='text-[12px]'>Product Name</p>
                    <p className='font-bold text-sm'>Laptop</p>
                  </div>
                  <div className='col-span-4 py-4'>
                    <p className='text-[12px]'>Product Description</p>
                    <p className='font-bold text-sm'>Laptops are designed to be portable computers.</p>
                  </div>
                </Grid>
                <Grid className='border-b px-4'>
                  <div className='col-span-3 py-4 border-r'>
                    <p className='text-[12px]'>Term</p>
                    <p className='font-bold text-sm'>18 Months</p>
                  </div>
                  <div className='col-span-3 py-4 border-r'>
                    <p className='text-[12px]'>Unit Price</p>
                    <p className='font-bold text-sm'>$20.00</p>
                  </div>
                  <div className='col-span-3 py-4 border-r'>
                    <p className='text-[12px]'># of Products</p>
                    <p className='font-bold text-sm'>2</p>
                  </div>
                  <div className='col-span-3 py-4'>
                    <p className='text-[12px]'>Price</p>
                    <p className='font-bold text-sm'>$100.00</p>
                  </div>
                </Grid>
                <Grid className=' px-4'>
                  <div className='col-span-12 py-4'>
                    <p className='text-[12px]'>Note</p>
                    <p className='font-bold text-sm'>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
                  </div>
                </Grid>
              </div>
            </div>
            <div className='col-span-4'>
              <p className='text-2xl font-bold text-[#bbbbbc] mb-4'>Uploaded  Data</p>
              <div className='border border-dashed w-full h-[83%] relative flex'>
                <div className='self-center text-center'>
                  <img src={Dropbox} className="mx-auto mb-3" alt="Dropbox" />
                  <p className="text-[#5D6E66] text-sm">
                    Accepted file types: csv, xls, xlsx Max. file size: 50 MB.
                  </p>
                </div>
              </div>
            </div>
          </Grid>
        </div>
        <Button className='!bg-white !text-black' onClick={prevStep}>Previous</Button>
        <Button>Submit</Button>
      </>

    );
  };

  return (
    <div className='my-8 ml-3'>
      <Headbar />
      <div className='flex mt-2'>
        <Link to={'/orderList'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-[#D1D1D1] rounded-[25px]'>
          <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage' />
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
      <div className='flex my-4 ml-3'>
        <div className='text-center'>
          {currentStep > 1 ? (<img src={check} className='text-center mx-auto' />) : (
            <p className='border border-black rounded-full mx-auto w-[26px]'>1</p>
          )}

          <p className={` ${currentStep == 1 ? ('text-black') : ('text-[#ADADAD] ')} text-sm font-bold`}>Order Details</p>
        </div>
        <hr className='w-[150px] border-black mt-3' />
        <div className='text-center'>
          {currentStep > 2 ? (<img src={check} className='text-center mx-auto' />) : (
            <p className={`border ${currentStep > 1 ? ('text-black border-black') : ('text-[#ADADAD] border-[#ADADAD]')}  rounded-full mx-auto w-[26px]`}>2</p>
          )}

          <p className={` ${currentStep == 2 ? ('text-black') : ('text-[#ADADAD] ')} text-sm font-bold`}>Dealer Order Details</p>
        </div>
        <hr className={`w-[150px]  ${currentStep > 2 ? 'border-black' : 'border-[#ADADAD]'} mt-3`} />
        <div className='text-center'>

          {currentStep > 3 ? (<img src={check} className='text-center mx-auto' />) : (
            <p className={`border ${currentStep > 2 ? ('text-black border-black') : ('text-[#ADADAD] border-[#ADADAD]')} rounded-full mx-auto w-[26px]`}>3</p>
          )}

          <p className={` ${currentStep == 3 ? ('text-black') : ('text-[#ADADAD] ')}text-sm font-bold`}>Add Product</p>
        </div>
        <hr className={`w-[150px]  ${currentStep > 3 ? 'border-black' : 'border-[#ADADAD]'} mt-3`} />
        <div className='text-center'>
          <p className={`border ${currentStep > 3 ? ('text-black border-black') : ('text-[#ADADAD] border-[#ADADAD]')} rounded-full mx-auto w-[26px]`}>4</p>
          <p className={` ${currentStep == 4 ? ('text-black') : ('text-[#ADADAD] ')}text-sm font-bold`}>Order Details</p>
        </div>
      </div>


      {renderStep()}



    </div>
  )
}

export default AddOrder