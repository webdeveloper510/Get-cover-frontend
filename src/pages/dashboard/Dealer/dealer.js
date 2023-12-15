import React, { useState } from "react";
import Headbar from "../../../common/headBar";
import { Link } from "react-router-dom";
import Select from "../../../common/select";
import Grid from "../../../common/grid";
import Input from "../../../common/input";

// Media Include
import BackImage from "../../../assets/images/icons/backArrow.svg";
import DeleteImage from '../../../assets/images/icons/Delete.svg'
import Button from "../../../common/button";
import RadioButton from "../../../common/radio";
import FileDropdown from "../../../common/fileDropbox";

function Dealer() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedOption, setSelectedOption] = useState("option1");

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };
  const handleSelectChange1 = (name, value) => {
    setSelectedCity(value);
  };
  console.log("here");
  const country = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];
  const city = [
    { label: "Country", value: "country" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
  ];

  return (
    <div className="my-8 ml-3">
      <Headbar />
      <div className="flex mt-14">
        {/* <div className='p-5 border-2 border-[#D1D1D1] rounded-xl'>
          <img src={BackImage} alt='BackImage'/>
        </div> */}
        <div className="pl-3">
          <p className="font-semibold text-[36px] leading-9	mb-[3px]">
            Dealer
          </p>
          <ul className="flex self-center">
            <li className="text-sm text-neutral-grey font-Regular">
              <Link to={"/"}>Dealer </Link> /{" "}
            </li>
            <li className="text-sm text-neutral-grey font-semibold ml-2 pt-[1px]">
              {" "}
              Add New Dealer{" "}
            </li>
          </ul>
        </div>
      </div>

      {/* Form Start */}

      <form className="mt-8">
        <div className="bg-white p-8 drop-shadow-4xl rounded-xl">
          <Grid>
            <div className="col-span-4 border-e-[1px] border-[#D1D1D1] pr-3">
              <p className="text-light-black text-lg mb-3 font-semibold">
                Create Dealer Account
              </p>
              <Grid>
                <div className="col-span-12 mt-4">
                  <Input
                    type="text"
                    name="AccountName"
                    required={true}
                    className='!bg-white'
                    label="Account Name"
                    placeholder=""
                  />
                </div>
                <div className="col-span-12">
                  <div className="flex">
                    <p className="text-neutral-grey">ADDRESS</p>
                    <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
                  </div>
                </div>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="customerStreetAddress"
                    className='!bg-white'
                    required={true}
                    label="Business Street Address"
                    placeholder=""
                  />
                </div>
                <div className="col-span-12">
                  <Select
                    label="Business City *"
                    className='!bg-white'
                    options={city}
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}
                  />
                </div>
                <div className="col-span-12">
                  <Select
                    label="Business State *"
                    options={city}
                    className='!bg-white'
                    selectedValue={selectedCity}
                    onChange={handleSelectChange1}
                  />
                </div>
                <div className="col-span-12">
                  <Input
                    type="text"
                    name="zipcode"
                    className='!bg-white'
                    label="Business Zipcode "
                    required={true}
                    placeholder=""
                  />
                </div>
              </Grid>
            </div>
            <div className="col-span-8">
              <p className="text-light-black text-lg mb-3 font-semibold">
                Dealer Contact Information
              </p>
             
              <Grid className="mt-5">
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="fName"
                    label="First Name"
                    className='!bg-white'
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="lName"
                    className='!bg-white'
                    label="Last Name"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="email"
                    name="email"
                    className='!bg-white'
                    label="Email"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    className='!bg-white'
                    name="phone"
                    label="Phone"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    type="text"
                    name="Position"
                    className='!bg-white'
                    label="Position"
                    placeholder=""
                  />
                </div>
                <div className="col-span-6">
                  <p className="text-light-black flex text-[12px]  font-semibold mt-3 mb-6">
                     Do you want to create an account?
                    <RadioButton
                      id="yes"
                      label="Yes"
                      value="yes"
                      checked={selectedOption === "yes"}
                      onChange={handleRadioChange}
                    />
                    <RadioButton
                      id="no"
                      label="No"
                      value="no"
                      checked={selectedOption === "no"}
                      onChange={handleRadioChange}
                    />
                  </p>
                </div>
                <div className="col-span-12 mt-5">
                  <p className="text-light-black flex text-[12px]  font-semibold mt-3 mb-6">
                    Does this Dealer's Customer will have separate account ?
                    <RadioButton
                      id="yes"
                      label="Yes"
                      value="yes"
                      checked={selectedOption === "yes"}
                      onChange={handleRadioChange}
                    />
                    <RadioButton
                      id="no"
                      label="No"
                      value="no"
                      checked={selectedOption === "no"}
                      onChange={handleRadioChange}
                    />
                  </p>
                </div>
                
              </Grid>

              <div className='mt-8'>
                   <Grid>
                    <div className='col-span-4'>
                      <Button className='text-sm !font-light w-full'>+  Add More Team Members</Button>
                    </div>
                    <div className='col-span-8 self-center'>
                      <hr/>
                    </div>
                   </Grid>
                </div>
            </div>
          </Grid>
        </div>
        
        <div className="bg-white p-8 relative drop-shadow-4xl mt-8 rounded-xl">
          <p className="text-light-black text-lg mb-6 font-semibold">
          Add Dealer’s Team Members
          </p>
          <div className="">
            <Grid className="">
              <div className='col-span-11'>
                <Grid className='pr-12 pl-4'>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerAccountName"
                    label="First Name"
                    className='!bg-white'
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerStreetAddress"
                    className='!bg-white'
                    label="Last Name"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerAccountName"
                    className='!bg-white'
                    label="Email"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerStreetAddress"
                    className='!bg-white'
                    label="Phone"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="text"
                    name="customerAccountName"
                    className='!bg-white'
                    label="Position"
                    required={true}
                    placeholder=""
                  />
                </div>
                <div className='col-span-4'>
                  <p className='text-light-black flex text-[12px]  font-semibold mt-3 mb-6' > Do you want to create an account?       
                <RadioButton
                  id="yes"
                  label="Yes"
                  value="yes"
                  checked={selectedOption === 'yes'}
                  onChange={handleRadioChange}
                />
  
                <RadioButton
                  id="no"
                  label="No"
                  value="no"
                  checked={selectedOption === 'no'}
                  onChange={handleRadioChange}
                />
                 </p>
                  </div>
                </Grid>
              </div>
              <div className='col-span-1'>
                <div className='flex h-full bg-[#EBEBEB] justify-center'>
                  <img src={DeleteImage} className='self-center cursor-pointer' alt='Delete Icon'/>
                </div>
              </div>
            </Grid>
          </div>
        </div>

        <div className="bg-[#fff] p-8 relative drop-shadow-4xl border-[1px] mt-8 border-[#D1D1D1] rounded-xl">
          <Grid>
            <div className="col-span-3">
              <p className="text-light-black text-lg mb-3 font-semibold">
                Add / Upload Price Book
              </p>
            </div>
            <div className="col-span-4 self-center">
              <hr className="self-center ml-3 border-[#D1D1D1] w-full" />
            </div>
            <div className="col-span-5 flex">
              <RadioButton
                id="yes"
                label="Add Single Price Book"
                value="yes"
                checked={selectedOption === "yes"}
                onChange={handleRadioChange}
              />

              <RadioButton
                id="no"
                label="Upload In Bulk"
                value="no"
                checked={selectedOption === "no"}
                onChange={handleRadioChange}
              />
            </div>
          </Grid>
          <div className="bg-[#f9f9f9] p-4 relative mt-8 rounded-xl">
            <p className="text-light-black text-lg mb-5 font-semibold">
              Add Single Price Book
            </p>
            <div className="bg-[#fff] rounded-[30px] absolute top-[-17px] right-[-12px] p-4">
              <Button className="text-sm "> + Add More </Button>
            </div>
            <Grid className="pr-4 pl-4">
              <div className="col-span-4">
                <Select
                  label="Business City"
                  options={city}
                  selectedValue={selectedCity}
                  onChange={handleSelectChange1}
                />
              </div>
              <div className="col-span-4">
                <Select
                  label="Business City *"
                  options={city}
                  selectedValue={selectedCity}
                  onChange={handleSelectChange1}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="text"
                  name="wholesale"
                  label="Prize($)"
                  required={true}
                  placeholder=""
                />
              </div>
              <div className="col-span-2">
                <Select
                  label="Term *"
                  options={city}
                  selectedValue={selectedCity}
                  onChange={handleSelectChange1}
                />
              </div>
              <div className="col-span-4">
                <Input
                  type="text"
                  name="description"
                  label="Description"
                  required={true}
                  placeholder=""
                />
              </div>
              <div className="col-span-4">
                <Input
                  type="number"
                  name="description"
                  label="Retail Price($)"
                  required={true}
                  placeholder=""
                />
              </div>
              <div className="col-span-4">
                <Select
                  label="Status *"
                  options={city}
                  selectedValue={selectedCity}
                  onChange={handleSelectChange1}
                />
              </div>
            </Grid>
          </div>
          <div className="bg-[#f9f9f9] p-4 relative drop-shadow-4xl border-[1px] mt-8 border-[#D1D1D1] rounded-xl">
            <p className="text-[#717275] text-lg mb-5 font-semibold">
              Upload In Bulk
            </p>
            <FileDropdown />
            <p className="text-[10px] mt-1 text-[#5D6E66] font-medium">
              Please click on file option and make a copy. Upload the list of
              Product Name and Price using our provided Google Sheets template,
              by <span className="underline">Clicking here </span>. The file
              must be saved with CSV Format.
            </p>
          </div>
        </div>
        <Button className="mt-4">Submit</Button>
      </form>
    </div>
  );
}

export default Dealer;
