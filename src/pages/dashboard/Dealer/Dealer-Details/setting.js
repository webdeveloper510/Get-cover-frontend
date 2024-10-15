import React, { useEffect, useRef, useState } from "react";
import Grid from "../../../../common/grid";
import Select from "../../../../common/select";
import RadioButton from "../../../../common/radio";
import Checkbox from "../../../../common/checkbox";
import Input from "../../../../common/input";
import Card from "../../../../common/card";
import Primary from "../../../../assets/images/SetPrimary.png";
import Cross1 from "../../../../assets/images/Cross_Button.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  DownloadSet,
  getCovrageList,
} from "../../../../services/priceBookService";
import Button from "../../../../common/button";
import download from "../../../../assets/images/downloads.png";
import {
  editDealerSettings,
  uploadTermsandCondition,
} from "../../../../services/dealerServices";
import { RotateLoader } from "react-spinners";
import Modal from "../../../../common/model";

function Setting(props) {
  console.log("i am looking for this ", props?.dealerDetails);
  const [selectedFile2, setSelectedFile2] = useState({
    fileName: "",
    name: "",
    size: "",
  });
  const [createAccountOption, setCreateAccountOption] = useState("yes");
  const [separateAccountOption, setSeparateAccountOption] = useState("yes");
  const [shipping, setShipping] = useState("yes");
  const [coverage, setCoverage] = useState([]);
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(3);
  const [primaryText, SetPrimaryText] = useState("");
  const [secondaryText, SetSecondaryText] = useState("");
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
    noOfClaimPerPeriod: -1,
    serviceCoverageType: "",
    coverageType: [],
    isShippingAllowed: false,
    noOfClaim: {
      period: "Monthly",
      value: -1,
    },
    isManufacturerWarranty: false,
    isMaxClaimAmount:false,
    file: "",
    oldName: "",
    isServicer: createServicerAccountOption,
    adhDays: coverage.reduce((acc, type) => {
      acc.push({
        value: type.value,
        waitingDays: 0,
        deductible: 0,
      });
      return acc;
    }, []),
  });

  useEffect(() => {
    let intervalId;

    if (isModalOpen && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      closeModal();
       window.location.reload();
    }

    if (!isModalOpen) {
      clearInterval(intervalId);
      setTimer(3);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isModalOpen, timer]);

  const closeModal = () => {
    SetIsModalOpen(false);
  };

  useEffect(() => {
    setLoading1(true);
    const dealer = props?.dealerDetails;
    console.log( dealer?.termCondition?.fileName==undefined)

    if (dealer?.serviceCoverageType) {
      setShipping(dealer.isShippingAllowed ? "yes" : "no");
      setServicerCreateAccountOption(dealer.isServicer);
      setClaimInCoveragePeriod(dealer.settings?.noOfClaimPerPeriod === -1);
      setClaimOver(dealer.settings?.noOfClaim?.value === -1);
      setCreateAccountOption(dealer.isAccountCreate ? "yes" : "no");
       setSeparateAccountOption(dealer.userAccount ? "yes" : "no");
      setSelectedFile2(
        dealer?.termCondition.fileName == undefined ? {
          fileName: "",
          name: "",
          size: "",
        } : dealer?.termCondition
      );
      console.log(dealer.settings);
      setInitialFormValues((prevValues) => ({
        ...prevValues,
        isServicer: dealer.isServicer,
        isShippingAllowed: dealer.isShippingAllowed,
        coverageType: dealer.coverageType,
        serviceCoverageType: dealer.serviceCoverageType,
        adhDays: dealer.adhDays,
        termCondition:  dealer?.termCondition.fileName == undefined ? {
          fileName: "",
          name: "",
          size: "",
        } : dealer?.termCondition,
        isManufacturerWarranty: dealer.settings?.isManufacturerWarranty,
        isMaxClaimAmount: dealer.settings?.isMaxClaimAmount,
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

  const handleFileChange =async (event) => {
    const file = event.target.files[0];
    const maxSize = 10048576;
    if (file?.size > maxSize) {
      formik.setFieldError(
        "termCondition",
        "File is too large. Please upload a file smaller than 10MB."
      );
      console.log("Selected file:", file);
    } 
    else {
      setLoading1(true); 
      try {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
    
          const result = await uploadTermsandCondition(formData);
          
          console.log(result);
          formik.setFieldValue("termCondition", {
            fileName: result?.file?.filename,
            name: result?.file?.originalname,
            size: result?.file?.size,
          });
    
          setSelectedFile2(file); 
        } else {
          setSelectedFile2({
            fileName: "",
            name: "",
            size: "",
          });
        }
      } catch (error) {
        console.error("File upload failed:", error);
      } finally {
        setLoading1(false)
      }
    }
  };

  const handelDownload = async (fileName) => {
    try {
      const binaryString = await DownloadSet(fileName);
      const blob = new Blob([binaryString]);
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {}
  };

  const handleRadio = (event) => {
    setShipping(event.target.value);
  };

  const getCovrageListData = async () => {
    try {
      const res = await getCovrageList();
      console.log(res.result.value);
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
      formik.setFieldValue("userAccount", false);
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
      setSelectedFile2({
        fileName: "",
        name: "",
        size: "",
      });
    }
  };

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      serviceCoverageType: Yup.string()
        .transform((originalValue) => originalValue.trim())
        .required("Required"),
        coverageType: Yup.array()
        .min(1, "Required")
        .test(
          "adhDays-error-check",
          "Error in Coverage Type , Check Deductible Field",
          function () {
            const { adhDays } = this.parent;
            if (adhDays) {
              const adhErrors = adhDays.some((day) => {
                if (day.amountType === "percentage") {
                  return (
                    day.deductible === undefined ||
                    day.deductible > 99.99 ||
                    !/^\d+(\.\d{1,2})?$/.test(day.deductible)
                  );
                }
                return day.deductible < 0 || day.deductible === undefined;
              });
    
              return !adhErrors; 
            }
            return true; 
          }
        ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);
      values.isServicer = createServicerAccountOption;
      values.isShippingAllowed = shipping === "yes" ? true : false;
      values.userAccount =
        separateAccountOption === "yes" ? true : false;
      if (createAccountOption === "yes" || createAccountOption === "no") {
        values.isAccountCreate = createAccountOption === "yes" ? true : false;
      } else {
        values.isAccountCreate = createAccountOption;
      }
      try {
        const result = await editDealerSettings(
          values,
          props.dealerDetails._id
        );
        console.log(result);
        SetPrimaryText("Dealer Setting Updated Successfully");
        SetSecondaryText("Setting updated successfully");
        SetIsModalOpen(true);
        setTimer(3);
      } catch (error) {
        console.error("Error updating dealer settings:", error);
        SetPrimaryText("Error Updating Settings");
        SetSecondaryText(
          "There was an error updating the settings. Please try again."
        );
        SetIsModalOpen(true);
      } finally {
        setLoading(false);
      }
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
                       {selectedFile2.name == ""}
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
                     
                      {selectedFile2?.name != "" && (
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="absolute -right-2 -top-2 mx-auto mb-3"
                        >
                          <img src={Cross1} className="w-6 h-6" alt="Dropbox" />
                        </button>
                      )}
                      {selectedFile2?.name != "" ? (
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
                
                {props?.dealerDetails?.termCondition?.fileName ? (
  <div className="col-span-2 pt-1">
    <Button
      className="w-full flex"
      onClick={() => handelDownload(props?.dealerDetails?.termCondition?.fileName)}
    >
      <img src={download} className="w-[20px]" alt="download" />
      <span className="self-center pl-2"> Download </span>
    </Button>
  </div>
) : null}


                <div className="col-span-6">
                  <Grid className="!gap-0">
                    <div className="col-span-8">
                      <p className="flex text-[12px]  font-semibold justify-between pr-4">
                        Do you want to create an account?
                      </p>
                    </div>
                    <div className="col-span-4">
                      <div className="flex w-full justify-between">
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
                    </div>
                    <div className="col-span-8 mt-3">
                      <p className="flex text-[12px] font-semibold justify-between pr-4">
                        <span className="mr-[0.58rem]">
                          Do you want to Provide Shipping?
                        </span>
                      </p>
                    </div>
                    <div className="col-span-4 mt-3">
                      <div className="flex justify-between">
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
                    </div>
                    <div className="col-span-8 mt-3">
                      <p className="text-[12px] font-semibold">
                        # of Claims Over the Certain Period
                      </p>
                    </div>
                    <div className="col-span-4 mt-3">
                      <div className="flex justify-between">
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
                              value: 1,
                            });
                          }}
                        />
                      </div>
                    </div>
                    {claimOver === false && (
                      <div className="flex col-span-12 my-2">
                        <Select
                          name={`noOfClaim.period`}
                          options={period}
                          className="!bg-grayf9"
                          placeholder=""
                          className1="!pt-2.5"
                          disableFirstOption={true}
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
                            type="tel"
                            name={`noOfClaim.value`}
                            value={formik.values.noOfClaim.value}
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              const finalValue =
                                e.target.value === ""
                                  ? 1
                                  : Math.max(1, parseInt(e.target.value, 10));
                              formik.setFieldValue(
                                "noOfClaim.value",
                                finalValue
                              );
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="col-span-8 mt-3">
                      <p className="text-[12px] font-semibold">
                        # of Claims in Coverage Period
                      </p>
                    </div>
                    <div className="col-span-4 mt-3">
                      <div className="flex justify-between">
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
                            formik.setFieldValue("noOfClaimPerPeriod", 1);
                          }}
                        />
                      </div>
                    </div>
                    {claimInCoveragePeriod === false && (
                      <div className="flex flex-wrap col-span-12 ">
                        <div className="">
                          <Input
                            className1="!pt-2.5"
                            placeholder="# of claims"
                            type="tel"
                            name={`noOfClaimPerPeriod`}
                            value={formik.values.noOfClaimPerPeriod}
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              const finalValue =
                                e.target.value === ""
                                  ? 1
                                  : Math.max(1, parseInt(e.target.value, 10));

                              formik.setFieldValue(
                                "noOfClaimPerPeriod",
                                finalValue
                              );
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Grid>
                </div>
                <div className="col-span-6">
                  <Grid className="!gap-0">
                    <div className="col-span-8">
                      <p className="flex text-[12px] font-semibold self-center justify-between pr-4">
                        {" "}
                        <span className="mr-[0.2rem]">
                          {" "}
                          Do you want to work as a servicer?
                        </span>
                      </p>
                    </div>
                    <div className="col-span-4">
                      <div className="flex justify-between">
                        <RadioButton
                          id="yes"
                          label="Yes"
                          value={true}
                          checked={createServicerAccountOption === true}
                          disabled={props?.dealerDetails?.isServicer}
                          onChange={handleServiceChange}
                        />
                        <RadioButton
                          id="no"
                          label="No"
                          value={false}
                          checked={createServicerAccountOption === false}
                          disabled={props?.dealerDetails?.isServicer}
                          onChange={handleServiceChange}
                        />
                      </div>
                    </div>
                    <div className="col-span-8 mt-3">
                      <p className="flex text-[12px] font-semibold justify-between">
                        <span className="">
                          {" "}
                          Do you want account for customer?{" "}
                        </span>
                      </p>
                    </div>
                    <div className="col-span-4 mt-3">
                      <div className="flex justify-between">
                        <RadioButton
                          id="yes-separate-account"
                          label="Yes"
                          value="yes"
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
                    </div>
                    <div className="col-span-8 mt-3">
                      <p className=" text-[12px] font-semibold ">
                        {" "}
                        Is There a Maximum Claim Amount?
                      </p>
                    </div>
                    <div className="col-span-4 mt-3">
                      <div className="flex justify-between">
                        <RadioButton
                          className="self-start"
                          id="yes-warranty"
                          label="Yes"
                          value={true}
                          checked={formik.values.isMaxClaimAmount == true}
                          onChange={() =>
                            formik.setFieldValue("isMaxClaimAmount", true)
                          }
                        />
                        <RadioButton
                          className="self-start"
                          id="no-warranty"
                          label="No"
                          value={false}
                          checked={
                            formik.values.isMaxClaimAmount === false
                          }
                          onChange={() =>
                            formik.setFieldValue(
                              "isMaxClaimAmount",
                              false
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-8 mt-3">
                      <p className=" text-[12px] font-semibold ">
                        {" "}
                        Is manufacturer warranty included?
                      </p>
                    </div>
                    <div className="col-span-4 mt-3">
                      <div className="flex justify-between">
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
                          checked={
                            formik.values.isManufacturerWarranty === false
                          }
                          onChange={() =>
                            formik.setFieldValue(
                              "isManufacturerWarranty",
                              false
                            )
                          }
                        />
                      </div>
                    </div>
                  </Grid>
                </div>
                <div className="col-span-12">
                  <p className="text-base mb-3 font-semibold">
                    Coverage Type :
                  </p>
                  <Grid>
                    {coverage.map((type, index) => (
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
                              console.log(updatedadhDays, type.value);

                              if (updatedCoverage.includes(type.value)) {
                                if (
                                  !updatedadhDays?.find(
                                    (item) => item.value === type.value
                                  )
                                ) {
                                  updatedadhDays = [
                                    ...updatedadhDays,
                                    {
                                      value: type.value,
                                      waitingDays: 0,
                                      deductible: 0,
                                    },
                                  ];
                                }
                              } else {
                                updatedadhDays = updatedadhDays.filter(
                                  (item) => item.value !== type.value
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
                                type="tel"
                                name={`adhDays[${type.value}].waitingDays`}
                                label={`Waiting Days`}
                                className="!bg-white"
                                maxDecimalPlaces={2}
                                minLength={"1"}
                                maxLength={"10"}
                                value={
                                  formik?.values?.adhDays?.find(
                                    (item) => item.value === type.value
                                  )?.waitingDays || 0
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  let newValue =
                                    e.target.value === ""
                                      ? 0
                                      : Math.max(
                                          1,
                                          parseInt(e.target.value, 10)
                                        );
                                  const updatedadhDays =
                                    formik?.values?.adhDays?.map((item) =>
                                      item.value === type.value
                                        ? {
                                            ...item,
                                            waitingDays: Number(newValue),
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
                                name={`adhDays[${type.value}].deductible`}
                                label={`Deductible`}
                                maxDecimalPlaces={2}
                                minLength={"1"}
                                maxLength={"10"}
                                className="!bg-white "
                                value={
                                  formik?.values?.adhDays?.find(
                                    (item) => item.value === type.value
                                  )?.deductible || 0
                                }
                                onBlur={formik.handleBlur}
                                onChange={(e) => {
                                  let newValue =
                                    parseFloat(e.target.value) || 0;
                                  newValue = newValue.toFixed(2);
                                  const updatedadhDays =
                                    formik?.values?.adhDays?.map((item) =>
                                      item.value === type.value
                                        ? {
                                            ...item,
                                            deductible: Number(newValue),
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
                                        item.value === type.value
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
                                      (item) => item.value === type.value
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
                     
                  </Grid>
                  {formik.touched.coverageType &&
                    formik.errors.coverageType && (
                      <div className="text-red-500 text-sm pl-2 pt-2">
                        {formik.errors.coverageType}
                      </div>
                    )}
                </div>
              </Grid>

              <div className="text-left my-5">
                <Button type="submit">Submit</Button>
              </div>
            </Card>
          </form>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto" />
          <p className="text-3xl mb-0 mt-2 font-bold">{primaryText}</p>
          <p className="text-base font-medium mt-4">
            {secondaryText} <br />
            Redirecting Back to User List in {timer} Seconds
          </p>
        </div>
      </Modal>
    </>
  );
}

export default Setting;
