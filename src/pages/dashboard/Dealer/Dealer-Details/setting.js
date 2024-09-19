import React, { useEffect, useRef, useState } from "react";
import Grid from "../../../../common/grid";
import Select from "../../../../common/select";
import RadioButton from "../../../../common/radio";
import Checkbox from "../../../../common/checkbox";
import Input from "../../../../common/input";
import Card from "../../../../common/card";
import Cross1 from "../../../../assets/images/Cross_Button.png";
import { useFormik } from "formik";
import { getCovrageList } from "../../../../services/priceBookService";
import Button from "../../../../common/button";
import download from "../../../../assets/images/downloads.png";
import {
  editDealerSettings,
  uploadTermsandCondition,
} from "../../../../services/dealerServices";
import { RotateLoader } from "react-spinners";

function Setting(props) {
  console.log("i am looking for this ", props?.dealerDetails);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [separateAccountOption, setSeparateAccountOption] = useState("yes");
  const [shipping, setShipping] = useState("yes");
  const [coverage, setCoverage] = useState([]);
  const [selectedOption, setSelectedOption] = useState("yes");
  const [createAccount, setCreateAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [claimOver, setClaimOver] = useState(true);
  const inputRef = useRef(null);
  const [createServicerAccountOption, setServicerCreateAccountOption] =
    useState(false);
  const [claimInCoveragePeriod, setClaimInCoveragePeriod] = useState(true);
  const [initialFormValues, setInitialFormValues] = useState({
    serviceCoverageType: "",
    isAccountCreate: createAccount,
    userAccount: separateAccountOption,
    termCondition: {
      fileName: "",
      name: "",
      size: "",
    },
    isAccountCreate: false,
    customerAccountCreated: false,
    noOfClaimPerPeriod: -1,
    serviceCoverageType: "",
    coverageType: [],
    isShippingAllowed: false,
    noOfClaim: {
      period: "Monthly",
      value: -1,
    },
    isManufacturerWarranty: false,
    file: "",
    oldName: "",
    isServicer: createServicerAccountOption,
    adhDays: coverage.reduce((acc, type) => {
      acc.push({
        label: type.value,
        value: 0,
        value1: 0,
      });
      return acc;
    }, []),
  });

  useEffect(() => {
    setLoading1(true);
    const dealer = props?.dealerDetails;

    if (dealer?.serviceCoverageType) {
      setShipping(dealer.isShippingAllowed ? "yes" : "no");
      setServicerCreateAccountOption(dealer.isServicer);
      setClaimInCoveragePeriod(dealer.settings?.noOfClaimPerPeriod === -1);
      setClaimOver(dealer.settings?.noOfClaim?.value === -1);
      setCreateAccountOption(dealer.userAccount ? "yes" : "no");
      setSeparateAccountOption(dealer.isAccountCreat ? "yes" : "no");
      setSelectedFile2(
        dealer?.termCondition.fileName == ""
          ? null
          : dealer?.termCondition.fileNames
      );
      console.log(dealer.settings);
      setInitialFormValues((prevValues) => ({
        ...prevValues,
        isServicer: dealer.isServicer,
        isShippingAllowed: dealer.isShippingAllowed,
        coverageType: dealer.coverageType,
        serviceCoverageType: dealer.serviceCoverageType,
        adhDays: dealer.adhDays,
        termCondition: dealer.termCondition,
        isManufacturerWarranty: dealer.settings?.isManufacturerWarranty,
        noOfClaimPerPeriod: dealer.settings?.noOfClaimPerPeriod,
        noOfClaim: dealer.settings?.noOfClaim,
        userAccount: dealer.userAccount,
        isAccountCreate: dealer.isAccountCreate,
      }));
    }
    setLoading1(false);
  }, [props]);

  const period = [
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ];
  const optiondeductibles = [
    { label: "$", value: "amount" },
    { label: "%", value: "percentage" },
  ];
  const handleServiceChange = (event) => {
    const valueAsBoolean = JSON.parse(event.target.value.toLowerCase());
    setServicerCreateAccountOption(valueAsBoolean);
  };
  const serviceCoverage = [
    { label: "Parts", value: "Parts" },
    { label: "Labor ", value: "Labour" },
    { label: "Parts & Labor ", value: "Parts & Labour" },
  ];

  const handleSelectChange1 = (name, value) => {
    formik.setFieldValue(name, value);
  };

  const handleSeparateAccountRadioChange = (event) => {
    setSeparateAccountOption(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 10048576;
    if (file?.size > maxSize) {
      formik.setFieldError(
        "termCondition",
        "File is too large. Please upload a file smaller than 10MB."
      );
      console.log("Selected file:", file);
    } else {
      const formData = new FormData();
      formData.append("file", file);
      const result = uploadTermsandCondition(formData).then((res) => {
        console.log(result);
        formik.setFieldValue("termCondition", {
          fileName: res?.file?.filename,
          name: res?.file?.originalname,
          size: res?.file?.size,
        });
      });
      if (file != undefined) {
        setSelectedFile2(file);
      } else {
        setSelectedFile2({
          fileName: "",
          name: "",
          size: "",
        });
      }
    }

    console.log("Selected file:================", file);
  };

  const handleRadio = (event) => {
    setShipping(event.target.value);
  };

  const getCovrageListData = async () => {
    try {
      const res = await getCovrageList();
      setCoverage(res.result.value);
    } catch (error) {
      console.error("Error fetching category list:", error);
    }
  };

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setCreateAccountOption(selectedValue);

    if (selectedValue === "no") {
      setSeparateAccountOption("no");
      formik.setFieldValue("isAccountCreate", false);
      formik.setFieldValue("customerAccountCreated", false);
    } else {
      formik.setFieldValue("isAccountCreate", true);
    }
  };

  const handleAddFile = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    if (inputRef) {
      formik.setFieldValue("termCondition", {});
      setSelectedFile2(null);
    }
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,

    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      values.isServicer = createServicerAccountOption;
      values.isShippingAllowed = shipping === "yes" ? true : false;
      values.customerAccountCreated =
        separateAccountOption === "yes" ? true : false;
      if (createAccountOption === "yes" || createAccountOption === "no") {
        values.isAccountCreate = createAccountOption === "yes" ? true : false;
      } else {
        values.isAccountCreate = createAccountOption;
      }

      const result = await editDealerSettings(values, props.dealerDetails._id);
      console.log(result);
      //     if (result.message === "Successfully Created") {
      //         setLoading(false);
      //         setError("done");
      //         setIsModalOpen(true);
      //         setMessage("New Dealer Created Successfully");
      //         setTimer(3);
      //         setSelected([]);
      //     } else if (result.message === "Dealer name already exists") {
      //         setLoading(false);
      //         formik.setFieldError("name", "Name Already Used");
      //         setMessage("Some Errors Please Check Form Validations ");
      //         setIsModalOpen(true);
      //     } else if (result.message === "Primary user email already exist") {
      //         setLoading(false);
      //         formik.setFieldError("email", "Email Already Used");
      //         setMessage("Some Errors Please Check Form Validations ");
      //         setIsModalOpen(true);
      //     } else if (result.message === "Invalid priceBook field") {
      //         if (
      //             result.message ===
      //             "Invalid file format detected. The sheet should contain exactly two columns."
      //         ) {
      //             setFileError(
      //                 "Invalid file format detected. The sheet should contain exactly two columns."
      //             );
      //             setLoading(false);
      //             setIsModalOpen(true);
      //             setMessage(
      //                 "Invalid file format detected. The sheet should contain exactly two columns."
      //             );
      //         } else {
      //             setFileError(null);
      //         }
      //     } else {
      //         setLoading(false);
      //         setIsModalOpen(true);
      //         setMessage(result.message);
      //     }
      setLoading(false);
    },
  });

  useEffect(() => {
    console.log("here1");
    getCovrageListData();
  }, []);

  return (
    <>
      {loading || loading1 ? (
        <div className=" h-[400px] w-full flex py-5">
          <div className="self-center mx-auto">
            <RotateLoader color="#333" />
          </div>
        </div>
      ) : (
        <div className="my-8">
          <form onSubmit={formik.handleSubmit}>
            <Card className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl p-5">
              <p className="text-lg mb-3 font-semibold">Dealer Setting</p>
              <Grid>
                <div className="col-span-6">
                  <Select
                    label="Service Coverage"
                    name="serviceCoverageType"
                    placeholder=""
                    className="!bg-white"
                    required={true}
                    onChange={handleSelectChange1}
                    options={serviceCoverage}
                    value={formik.values.serviceCoverageType}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.serviceCoverageType &&
                      formik.errors.serviceCoverageType
                    }
                  />
                  {formik.touched.serviceCoverageType &&
                    formik.errors.serviceCoverageType && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.serviceCoverageType}
                      </div>
                    )}
                </div>
                <div className="col-span-4">
                  <div className="relative">
                    <label
                      htmlFor="term"
                      className={`absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75 `}
                    >
                      Term And Condition
                    </label>
                    <input
                      type="file"
                      name="term"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="application/pdf"
                      ref={inputRef}
                    />
                    <div
                      className={`block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-transparent rounded-lg border-[1px] border-gray-300 appearance-none peer `}
                    >
                      {selectedFile2 && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute -right-2 -top-2 mx-auto mb-3"
                        >
                          <img src={Cross1} className="w-6 h-6" alt="Dropbox" />
                        </button>
                      )}
                      {selectedFile2 ? (
                        <p className="w-full break-words">
                          {selectedFile2.name}
                        </p>
                      ) : (
                        <p
                          className="w-full cursor-pointer"
                          onClick={handleAddFile}
                        >
                          {" "}
                          Select File
                        </p>
                      )}
                    </div>
                  </div>
                  {formik.errors.termCondition && (
                    <div className="text-red-500 text-sm pl-2 pt-2">
                      {formik.errors.termCondition}
                    </div>
                  )}
                  <small className="text-neutral-grey p-10p">
                    Attachment size limit is 10 MB
                  </small>
                </div>
                <div className="col-span-2 pt-1">
                  <Button className="w-full flex">
                    <img src={download} className="w-[20px]" alt="download" />{" "}
                    <span className="self-center pl-2"> Download </span>{" "}
                  </Button>
                </div>
                <div className="col-span-6">
                  <p className="flex text-[12px] mb-7 font-semibold justify-between pr-4">
                    Do you want to create an account?
                    <div className="flex">
                      <RadioButton
                        id="yes-create-account"
                        label="Yes"
                        value="yes"
                        checked={createAccountOption === "yes"}
                        onChange={handleRadioChange}
                      />
                      <RadioButton
                        id="no-create-account"
                        label="No"
                        value="no"
                        checked={createAccountOption === "no"}
                        onChange={handleRadioChange}
                      />
                    </div>
                  </p>
                  <p className="flex text-[12px] mb-7 font-semibold justify-between pr-4">
                    <span className="mr-[0.58rem]">
                      Do you want to Provide Shipping?
                    </span>
                    <div className="flex">
                      <RadioButton
                        id="yes-create-account"
                        label="Yes"
                        value="yes"
                        checked={shipping === "yes"}
                        onChange={handleRadio}
                      />
                      <RadioButton
                        id="no-create-account"
                        label="No"
                        value="no"
                        checked={shipping === "no"}
                        onChange={handleRadio}
                      />
                    </div>
                  </p>

                  <div className="flex justify-between pr-6">
                    <p className="text-[12px] mb-3 font-semibold">
                      # of Claims Over the Certain Period
                    </p>
                    <div className="flex">
                      <RadioButton
                        className="self-start"
                        id="yes-warranty"
                        label="Unlimited"
                        value={true}
                        checked={claimOver === true}
                        onChange={() => {
                          setClaimOver(true);
                          formik.setFieldValue("noOfClaim", {
                            period: "Monthly",
                            value: -1,
                          });
                        }}
                      />
                      <RadioButton
                        className="self-start"
                        id="no-warranty"
                        label="Fixed"
                        value={false}
                        checked={claimOver === false}
                        onChange={() => {
                          setClaimOver(false);
                          formik.setFieldValue("noOfClaim", {
                            period: "Monthly",
                            value: 0,
                          });
                        }}
                      />
                    </div>
                  </div>
                  {claimOver === false && (
                    <div className="flex flex-wrap">
                      <Select
                        name={`noOfClaim.period`}
                        options={period}
                        className="!bg-grayf9"
                        placeholder=""
                        className1="!pt-2.5"
                        OptionName={"Period"}
                        maxLength={"30"}
                        value={formik.values.noOfClaim.period}
                        onBlur={formik.handleBlur}
                        onChange={(name, value) =>
                          formik.setFieldValue(name, value)
                        }
                      />

                      <div className="ml-3">
                        <Input
                          className1="!pt-2.5"
                          placeholder="# of claims"
                          type="number"
                          name={`noOfClaim.value`}
                          value={formik.values.noOfClaim.value}
                          onBlur={formik.handleBlur}
                          onChange={(e) =>
                            formik.setFieldValue(
                              "noOfClaim.value",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between pr-6 my-4">
                    <p className="text-[12px] mb-3 font-semibold">
                      # of Claims in Coverage Period
                    </p>
                    <div className="flex">
                      <RadioButton
                        className="self-start"
                        id="yes-warranty"
                        label="Unlimited"
                        value={true}
                        checked={claimInCoveragePeriod === true}
                        onChange={() => {
                          setClaimInCoveragePeriod(true);
                          formik.setFieldValue("noOfClaimPerPeriod", -1);
                        }}
                      />
                      <RadioButton
                        className="self-start"
                        id="no-warranty"
                        label="Fixed"
                        value={false}
                        checked={claimInCoveragePeriod === false}
                        onChange={() => {
                          setClaimInCoveragePeriod(false);
                          formik.setFieldValue("noOfClaimPerPeriod", 0);
                        }}
                      />
                    </div>
                  </div>
                  {claimInCoveragePeriod === false && (
                    <div className="flex flex-wrap">
                      <div className="ml-3">
                        <Input
                          className1="!pt-2.5"
                          placeholder="# of claims"
                          type="number"
                          name={`noOfClaimPerPeriod`}
                          value={formik.values.noOfClaimPerPeriod}
                          onBlur={formik.handleBlur}
                          onChange={(e) =>
                            formik.setFieldValue(
                              "noOfClaimPerPeriod",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-span-6">
                  <p className="flex text-[12px] mb-7 font-semibold self-center justify-between pr-4">
                    {" "}
                    <span className="mr-[0.2rem]">
                      {" "}
                      Do you want to work as a servicer?
                    </span>
                    <div className="flex">
                      <RadioButton
                        id="yes"
                        label="Yes"
                        value={true}
                        checked={createServicerAccountOption === true}
                        onChange={handleServiceChange}
                      />
                      <RadioButton
                        id="no"
                        label="No"
                        value={false}
                        checked={createServicerAccountOption === false}
                        onChange={handleServiceChange}
                      />
                    </div>
                  </p>
                  <p className="flex text-[12px] mb-7 font-semibold justify-between pr-4">
                    <span className="w-[60%]">
                      {" "}
                      Do you want to create separate account for customer?{" "}
                    </span>
                    <div className="flex">
                      <RadioButton
                        id="yes-separate-account"
                        label="Yes"
                        value="yes"
                        className="!pl-2"
                        checked={separateAccountOption === "yes"}
                        disabled={createAccountOption === "no"}
                        onChange={handleSeparateAccountRadioChange}
                      />
                      <RadioButton
                        id="no-separate-account"
                        label="No"
                        value="no"
                        checked={separateAccountOption === "no"}
                        onChange={handleSeparateAccountRadioChange}
                      />
                    </div>
                  </p>
                  <div className="flex justify-between pr-4">
                    <p className=" text-[12px] mb-3 font-semibold ">
                      {" "}
                      Is Include manufacturer warranty?
                    </p>
                    <div className="flex">
                      <RadioButton
                        className="self-start"
                        id="yes-warranty"
                        label="Yes"
                        value={true}
                        checked={formik.values.isManufacturerWarranty == true}
                        onChange={() =>
                          formik.setFieldValue("isManufacturerWarranty", true)
                        }
                      />
                      <RadioButton
                        className="self-start"
                        id="no-warranty"
                        label="No"
                        value={false}
                        checked={formik.values.isManufacturerWarranty === false}
                        onChange={() =>
                          formik.setFieldValue("isManufacturerWarranty", false)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <p className="text-base mb-3 font-semibold">
                    Coverage Type :
                  </p>
                  <Grid>
                    {coverage.map((type) => (
                      <div key={type._id} className="col-span-3">
                        <div className="flex">
                          <Checkbox
                            name={`coverageType[${type.value}]`}
                            checked={formik?.values?.coverageType?.includes(
                              type?.value
                            )}
                            onChange={() => {
                              const selected = formik.values.coverageType;
                              const updatedCoverage = selected.includes(
                                type.value
                              )
                                ? selected.filter((item) => item !== type.value)
                                : [...selected, type.value];

                              formik.setFieldValue(
                                "coverageType",
                                updatedCoverage
                              );

                              let updatedadhDays = formik.values.adhDays || [];

                              if (updatedCoverage.includes(type.value)) {
                                if (
                                  !updatedadhDays?.find(
                                    (item) => item.label === type.value
                                  )
                                ) {
                                  updatedadhDays = [
                                    ...updatedadhDays,
                                    {
                                      label: type.value,
                                      value: 0,
                                      value1: 0,
                                    },
                                  ];
                                }
                              } else {
                                updatedadhDays = updatedadhDays.filter(
                                  (item) => item.label !== type.value
                                );
                              }

                              formik.setFieldValue("adhDays", updatedadhDays);
                            }}
                          />
                          <p className="font-semibold">{type.label}</p>
                        </div>

                        {formik?.values?.coverageType?.includes(type.value) && (
                          <>
                            <div className="my-3">
                              <Input
                                type="number"
                                name={`adhDays[${type.value}].value`}
                                label={`Waiting Days`}
                                className="!bg-white"
                                maxDecimalPlaces={2}
                                minLength={"1"}
                                maxLength={"10"}
                                value={
                                  formik?.values?.adhDays?.find(
                                    (item) => item.label === type.value
                                  )?.value || 0
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  let newValue =
                                    parseFloat(e.target.value) || 0;
                                  newValue = newValue.toFixed(2);
                                  const updatedadhDays =
                                    formik?.values?.adhDays?.map((item) =>
                                      item.label === type.value
                                        ? {
                                            ...item,
                                            value: Number(newValue),
                                          }
                                        : item
                                    );
                                  formik.setFieldValue(
                                    "adhDays",
                                    updatedadhDays
                                  );
                                }}
                              />
                            </div>
                            <div className="relative">
                              <Input
                                type="number"
                                name={`adhDays[${type.value}].value1`}
                                label={`Deductible`}
                                maxDecimalPlaces={2}
                                minLength={"1"}
                                maxLength={"10"}
                                className="!bg-white "
                                value={
                                  formik?.values?.adhDays?.find(
                                    (item) => item.label === type.value
                                  )?.value1 || 0
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  let newValue =
                                    parseFloat(e.target.value) || 0;
                                  newValue = newValue.toFixed(2);
                                  const updatedadhDays =
                                    formik?.values?.adhDays?.map((item) =>
                                      item.label === type.value
                                        ? {
                                            ...item,
                                            value1: Number(newValue),
                                          }
                                        : item
                                    );
                                  formik.setFieldValue(
                                    "adhDays",
                                    updatedadhDays
                                  );
                                }}
                              />
                              <div className="absolute top-[1px] right-[1px]">
                                <Select
                                  name="deductibles"
                                  label=""
                                  disableFirstOption={true}
                                  onChange={(e, value) => {
                                    const updatedadhDays =
                                      formik?.values?.adhDays?.map((item) =>
                                        item.label === type.value
                                          ? {
                                              ...item,
                                              amountType: value,
                                            }
                                          : item
                                      );
                                    formik.setFieldValue(
                                      "adhDays",
                                      updatedadhDays
                                    );
                                  }}
                                  value={
                                    formik?.values?.adhDays?.find(
                                      (item) => item.label === type.value
                                    )?.amountType || 0
                                  }
                                  classBox="!bg-transparent"
                                  className1="!border-0 !border-l !rounded-s-[0px] !text-light-black !pr-2"
                                  options={optiondeductibles}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {formik.touched.coverageType &&
                      formik.errors.coverageType && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.coverageType}
                        </div>
                      )}
                  </Grid>
                </div>
              </Grid>

              <div className="text-left my-5">
                <Button type="submit">Submit</Button>
              </div>
            </Card>
          </form>
        </div>
      )}
    </>
  );
}

export default Setting;
