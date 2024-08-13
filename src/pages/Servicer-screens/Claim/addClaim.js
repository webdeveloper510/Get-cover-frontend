import React, { useState } from 'react'
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
import RadioButton from '../../../common/radio';
import FileDropdown from '../../../common/fileDropbox';
import SelectBoxWIthSerach from '../../../common/selectBoxWIthSerach';
import DateInput from '../../../common/dateInput';

function ServicerAddClaim() {
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedOption, setSelectedOption] = useState('option1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  console.log(currentStep)

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      default:
        return null;
    }
  };

  const options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
    { label: "Option 5", value: "option5" },
  ];

  const handleSelect = (selectedOption) => {
    console.log('Selected Option:', selectedOption);
  };
  const [item, setItem] = useState({
    requested_order_ship_date: '2024-01-25',
  });
  const renderStep1 = () => {
    // Step 1 content
    return (
      <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl'>
        <p className='text-xl font-bold mb-4'>Step 1</p>
        <Grid>
          <div className='col-span-6'>
            <Grid>
              <div className='col-span-12'>
                <Input
                  label="Contract ID"
                  name="ContractID"
                  placeholder=""
                  className="!bg-white"
                  required={true}
                />
              </div>
            </Grid>
          </div>
          <div className='col-span-6 self-end justify-end flex'>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </Grid>
      </div>
    );
  };

  const renderStep2 = () => {
    // Step 2 content
    return (
      <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl'>
        <p className='text-2xl font-bold mb-4'>Enter Required Info</p>
        <Grid>
          <div className='col-span-12'>
            <Grid>
              <div className='col-span-3'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Dealer Name</p>
                  <p className='font-semibold'>Dealer Name</p>
                </div>
              </div>
              <div className='col-span-3'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Reseller Name</p>
                  <p className='font-semibold'>Reseller Name</p>
                </div>
              </div>
              <div className='col-span-3'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Customer Name</p>
                  <p className='font-semibold'>Customer Name</p>
                </div>
              </div>
              <div className='col-span-3'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Manufacturer</p>
                  <p className='font-semibold'>Manufacturer</p>
                </div>
              </div>
            </Grid>
            <Grid className='!grid-cols-5 mt-3'>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Model</p>
                  <p className='font-semibold'>Model</p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Serial</p>
                  <p className='font-semibold'>Serial</p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Order ID</p>
                  <p className='font-semibold'>Order ID</p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Retail Price($)</p>
                  <p className='font-semibold'>Retail Price($)</p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Condition</p>
                  <p className='font-semibold'>Condition</p>
                </div>
              </div>

            </Grid>
          </div>
        </Grid>

        <div className='my-4'>
          <p className='text-2xl font-bold mb-4'> Upload Receipt or Image </p>
          <Grid>
            <div className='col-span-6'>
              <Grid className='my-3'>
                <div className='col-span-6'>
                  <SelectBoxWIthSerach options={options} label="Servicer Name"
                    name="servicerName" className="!bg-white" onChange={handleSelect} />

                </div>
                <div className='col-span-6'>
                  <DateInput
                    label="Loss Date"
                    name="lossDate"
                    required
                    item={item}
                    setItem={setItem}
                    className="!bg-white" />
                </div>
              </Grid>
              <div className='border border-dashed w-full  relative py-2'>
                <div className='self-center text-center'>
                  <FileDropdown
                    className="!bg-transparent !border-0"

                  />
                </div>
              </div>
              <p className="text-[12px] mt-1 text-[#5D6E66] font-medium">
                Please click on file option and make a copy. Upload the list
                of Product Name and Price using our provided Google Sheets
                template, by{" "}
                <span
                  className="underline cursor-pointer"
                // onClick={downloadCSVTemplate}
                >
                  Clicking here
                </span>
                The file must be saved with csv , xls and xlsx Format.
              </p>
            </div>
            <div className='col-span-6'>
              <div className="relative">
                <label
                  htmlFor="description"
                  className="absolute text-base text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                >
                  Diagonsis <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="note"
                  rows="11"
                  name="Note"
                  maxLength={150}
                  className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold text-light-black bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer resize-none	"
                ></textarea>
              </div>
            </div>
            <div className="col-span-6">
              <p className="text-light-black flex text-[12px] font-semibold mt-3 mb-6">
                Do you want to send notifications?
                <RadioButton
                  id="yes-create-account"
                  label="Yes"
                  value="yes"
                // checked={createAccountOption === "yes"}
                // onChange={handleRadioChange}
                />
                <RadioButton
                  id="no-create-account"
                  label="No"
                  value="no"
                // checked={createAccountOption === "no"}
                // onChange={handleRadioChange}
                />
              </p>
            </div>
          </Grid>
          <Button className='!bg-white !text-black' onClick={prevStep}>Previous</Button>
          <Button>Submit</Button>
        </div>
      </div>
    );
  };




  return (
    <div className='my-8 ml-3'>
      <Headbar />
      <div className='flex mt-2'>
        <Link to={'/claimList'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]'>
          <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage' />
        </Link>
        <div className='pl-3'>
          <p className='font-bold text-[36px] leading-9 mb-[3px]'>Add Claim</p>
          <ul className='flex self-center'>
            <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Home </Link>  /  </li>
            <li className='text-sm text-neutral-grey font-semibold ml-1 pt-[1px]'> Add Claim  </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}
      <div className='flex my-4 ml-3'>
        <div className='text-center'>
          {currentStep > 1 ? (<img src={check} className='text-center mx-auto' />) : (
            <p className='border border-black rounded-full mx-auto w-[26px]'>1</p>
          )}

          <p className={` ${currentStep == 1 ? ('text-black') : ('text-[#ADADAD] ')} text-sm font-bold`}>Step 1</p>
        </div>
        <hr className='w-[150px] border-black mt-3' />
        <div className='text-center'>
          {currentStep > 2 ? (<img src={check} className='text-center mx-auto' />) : (
            <p className={`border ${currentStep > 1 ? ('text-black border-black') : ('text-[#ADADAD] border-[#ADADAD]')}  rounded-full mx-auto w-[26px]`}>2</p>
          )}

          <p className={` ${currentStep == 2 ? ('text-black') : ('text-[#ADADAD] ')} text-sm font-bold`}>Step 2</p>
        </div>
      </div>


      {renderStep()}



    </div>
  )
}

export default ServicerAddClaim