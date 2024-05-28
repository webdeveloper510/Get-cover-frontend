import React, { useEffect, useRef, useState } from 'react'
import Headbar from '../../../common/headBar'
import { Link } from 'react-router-dom'
import Select from '../../../common/select';
import Grid from '../../../common/grid';
import Input from '../../../common/input';

// Media Include
import BackImage from '../../../assets/images/icons/backArrow.svg'
import Dropbox from "../../../assets/images/icons/dropBox.svg";
import Edit from '../../../assets/images/Dealer/EditIcon.svg';
import Cross from "../../../assets/images/Cross.png";
import Delete from "../../../assets/images/icons/DeleteIcon.svg";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import check from "../../../assets/images/icons/check.svg";
import Button from '../../../common/button';
import RadioButton from '../../../common/radio';
import FileDropdown from '../../../common/fileDropbox';
import SelectBoxWIthSerach from '../../../common/selectBoxWIthSerach';
import DateInput from '../../../common/dateInput';
import Checkbox from '../../../common/checkbox';
import Modal from '../../../common/model';

function ResellerAddClaim() {
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const dropdownRef = useRef(null);
    console.log(currentStep)
    const [selectedActions, setSelectedActions] = useState([]);

    const handleToggleDropdown = (index) => {
        const newSelectedActions = [...selectedActions];
        newSelectedActions[index] = !newSelectedActions[index];
        setSelectedActions(newSelectedActions);
    };
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    setIsModalOpen(false);
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

  const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setSelectedActions(null);
      }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
      document.addEventListener("click", handleClickOutside);
      return () => {
          document.removeEventListener("click", handleClickOutside);
      };
  }, []);

    const renderStep1 = () => {
      // Step 1 content
      return (
        <div className='px-8 pb-8 pt-4 mb-8 drop-shadow-4xl bg-white border-[1px] border-Light-Grey  rounded-xl'>
            <p className='text-xl font-bold mb-4'>Step 1</p>
            <Grid>
              <div className='col-span-12'>
                <Grid>
                  <div className='col-span-4'>
                    <Input 
                     label="Contract ID"
                     name="ContractID"
                     placeholder=""
                     className="!bg-white"
                    //  required={true}
                    />
                    {/* <div className="ml-3 self-center">
                    <Checkbox />
                    </div> */}
                  </div>
                  <div className='col-span-4'>
                    <Input 
                     label="Customer Name"
                     name="CustomerName"
                     placeholder=""
                     className="!bg-white"
                    //  required={true}
                    />
                  </div>
                  <div className='col-span-4'>
                    <Input 
                     label="Serial Number"
                     name="Serial"
                     placeholder=""
                     className="!bg-white"
                    //  required={true}
                    />
                  </div>
                  <div className='col-span-4'>
                    <Input 
                     label="Order #"
                     name="OrderNumber"
                     placeholder=""
                     className="!bg-white"
                    //  required={true}
                    />
                  </div>
                  <div className='col-span-4'>
                    <Input 
                     label="Dealer P.O. #"
                     name="ContractID"
                     placeholder=""
                     className="!bg-white"
                    //  required={true}
                    />
                  </div>
                  <div className='col-span-4 self-end justify-end flex'>
                    <Button >Search</Button>
                  </div>
                </Grid>
              </div>
              <div className='col-span-12'>
                <table className='w-full border text-center'>
                  <thead className='bg-grayf9 '>
                    <tr className='py-2'>
                      <th>Contract ID</th>
                      <th className='!py-2'>Customer Name</th>
                      <th>Serial Number</th>
                      <th>Order #</th>
                      <th>Dealer P.O. #</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {Array.from({ length: 1 }).map((_, index) => (
                    <tr>
                      <td className='py-1'>Contract ID</td>
                      <td>Customer Name</td>
                      <td>Serial Number</td>
                      <td>Order #</td>
                      <td>Dealer P.O. #</td>
                      <td>
                        <div className="relative">
                            <div onClick={() => handleToggleDropdown(index)}>
                                <img src={ActiveIcon} className="cursor-pointer w-[35px] mx-auto" alt="Active Icon" />
                            </div>
                            {selectedActions[index] && (
                                <div  className="absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-2 bg-white border rounded-lg shadow-md top-[1rem]">
                                    <div className="text-center py-1 px-2 border-b text-[12px] border-[#E6E6E6] text-light-black cursor-pointer" onClick={nextStep}>
                                        <p>Select</p>
                                    </div>
                                    <div className="text-center py-1 px-2 text-[12px] border-[#E6E6E6] text-light-black cursor-pointer" onClick={() => openModal()}>
                                        <p>View</p>
                                    </div>
                                </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
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
          <Grid className='!grid-cols-4 mt-3'>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Dealer Name</p>
                  <p className='font-semibold'>Dealer Name</p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Customer Name</p>
                  <p className='font-semibold'>Customer Name</p>
                </div>
              </div>
              <div className='col-span-1'>
                <div className='bg-[#D9D9D9] rounded-lg px-4 pb-2 pt-1'>
                  <p className='text-sm m-0 p-0'>Manufacturer</p>
                  <p className='font-semibold'>Manufacturer</p>
                </div>
              </div>
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
                  <SelectBoxWIthSerach options={options}  label="Servicer Name"
                    name="servicerName" className="!bg-white" onChange={handleSelect} />
                
                    </div>
                    <div className='col-span-6'>
                      <Input
                        label="Loss Date"
                        name="lossDate"
                        required 
                        type='date'
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
        <Headbar/>
        <div className='flex mt-2'>
        <Link to={'/claimList'} className='h-[60px] w-[60px] flex border-[1px] bg-white border-Light-Grey rounded-[25px]'>
            <img src={BackImage} className='m-auto my-auto self-center bg-white' alt='BackImage'/>
          </Link>
          <div className='pl-3'>
            <p className='font-bold text-[36px] leading-9 mb-[3px]'>Add Claim</p>
            <ul className='flex self-center'>
              <li className='text-sm text-neutral-grey font-Regular'><Link to={'/'}>Claim </Link>  /  </li>
              <li className='text-sm text-neutral-grey font-semibold ml-2 pt-[1px]'> Add Claim  </li>
            </ul>
          </div>
        </div>
  
        {/* Form Start */}
          <div className='flex my-4 ml-3'>
            <div className='text-center'>
            {currentStep > 1 ? (<img src={check} className='text-center mx-auto'/>) : (
              <p className='border border-black rounded-full mx-auto w-[26px]'>1</p>
            )}
                
                <p className={` ${currentStep == 1 ? ('text-black') : ('text-[#ADADAD] ')} text-sm font-bold`}>Step 1</p>
            </div>
            <hr className='w-[150px] border-black mt-3'/>
            <div className='text-center'>
            {currentStep > 2 ? (<img src={check} className='text-center mx-auto'/>) : (
              <p className={`border ${currentStep > 1 ?('text-black border-black') : ('text-[#ADADAD] border-[#ADADAD]') }  rounded-full mx-auto w-[26px]`}>2</p>
            )}
                
                <p className={` ${currentStep == 2 ? ('text-black') : ('text-[#ADADAD] ')} text-sm font-bold`}>Step 2</p>
            </div>
          </div>
           

          {renderStep()}

          <Modal isOpen={isModalOpen} onClose={closeModal} className="!w-[1100px]">
              <Button
              onClick={closeModal}
              className="absolute right-[-13px] top-0 h-[80px] w-[80px] !p-[19px] mt-[-9px] !rounded-full !bg-Granite-Gray"
            >
              <img
                src={Cross}
                className="w-full h-full text-black rounded-full p-0"
              />
            </Button>
            <div className="text-center mt-2">
              <p className="text-3xl font-semibold mb-4">Contract Details</p>
              <div>
            <Grid className='bg-[#333333] !gap-2 !grid-cols-9 !px-3 rounded-t-xl'>
              <div className='col-span-2 self-center text-left bg-contract bg-contain bg-right bg-no-repeat rounded-ss-xl'>
                <p className='text-white py-2 font-Regular'>Contract ID :  <b> 861910 </b></p>
              </div>
              <div className='col-span-2 self-center text-left bg-contract bg-contain bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Order ID : <b> 315174  </b></p>
              </div>
              <div className='col-span-3 self-center text-left bg-contract bg-contain bg-right bg-no-repeat '>
                <p className='text-white py-2 font-Regular'>Dealer P.O. # : <b> MC-10554 </b></p>
              </div>
              <div className='col-span-1'></div>
              <div className='col-span-1 self-center justify-end self-center rounded-[20px] text-center bg-contract bg-cover bg-right bg-no-repeat'>
                <Button className='!bg-[transparent] !text-white !py-2 !font-Regular' onClick={nextStep}>Select</Button>
              </div>
            </Grid>

            <Grid className='!gap-0 !grid-cols-5 bg-grayf9 mb-5'>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Manufacturer</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple iPad</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Model</p>
                  <p className='text-[#333333] text-base font-semibold'>Apple iPad 5th Gen, 30GB</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Serial</p>
                  <p className='text-[#333333] text-base font-semibold'>GG7W212JHLF12</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Retail Price</p>
                  <p className='text-[#333333] text-base font-semibold'>$182</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Condition</p>
                  <p className='text-[#333333] text-base font-semibold'>Used</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey rounded-es-xl'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Customer Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Ankush Grover</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                
                 <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Servicer Name</p>
                  <p className='text-[#333333] text-base font-semibold'>Jameson Wills</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Claim Amount</p>
                  <p className='text-[#333333] text-base font-semibold'>$0.00</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey '>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage Start Date</p>
                  <p className='text-[#333333] text-base font-semibold'>11/09/2026</p>
                </div>
              </div>
              <div className='col-span-1 border border-Light-Grey rounded-ee-xl'>
                <div className='py-4 pl-3'>
                  <p className='text-[#5D6E66] text-sm font-Regular'>Coverage End Date</p>
                  <p className='text-[#333333] text-base font-semibold'>09/11/2030</p>
                </div>
              </div>
            </Grid>
          </div>
            </div>
          </Modal>
          
      </div>
    )
  }

export default ResellerAddClaim