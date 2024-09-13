import React, { useEffect, useRef, useState } from 'react'
import Grid from '../../../../common/grid'
import Select from '../../../../common/select';
import RadioButton from '../../../../common/radio';
import Checkbox from '../../../../common/checkbox';
import Input from '../../../../common/input';
import Card from '../../../../common/card';
import Cross1 from "../../../../assets/images/Cross_Button.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCovrageList } from '../../../../services/priceBookService';
import Button from '../../../../common/button';
import download from "../../../../assets/images/downloads.png";

function Setting() {
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [createAccountOption, setCreateAccountOption] = useState("yes");
    const [separateAccountOption, setSeparateAccountOption] = useState("yes");
    const [shipping, setShipping] = useState("yes");
    const [coverage, setCoverage] = useState([]);
    const [selectedOption, setSelectedOption] = useState("yes");
    const inputRef = useRef(null);
    const [createServicerAccountOption, setServicerCreateAccountOption] =
        useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        name: "",
        street: "",
        zip: "",
        state: "",
        country: "USA",
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: "",
        position: "",
        createdBy: "Super admin",
        role: "dealer",
        savePriceBookType: selectedOption,
        dealers: [],

        // priceBook: [
        //   {
        //     priceBookId: "",
        //     categoryId: "",
        //     wholesalePrice: "",
        //     terms: "",
        //     pName: "",
        //     description: "",
        //     retailPrice: "",
        //     status: "",
        //     dealerSku: "",
        //   },
        // ],
        isAccountCreate: false,
        customerAccountCreated: false,
        serviceCoverageType: "",
        coverageType: [],
        isShippingAllowed: false,
        noOfClaim: {
            period: "",
            value: -1,
        },
        isManufacturerWarranty: false,
        file: "",
        oldName: "",
        oldEmail: "",
        isServicer: createServicerAccountOption,
        termCondition: {},
        adhDays: coverage.reduce((acc, type) => {
            acc.push({
                label: type.value,
                value: 0,
                value1: 0,
            });
            return acc;
        }, []),
    });
    const period = [
        { label: "Monthly ", value: "monthly " },
        { label: "Annually ", value: "Annually " },
    ];
    const emailValidationRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

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
        const maxSize = 10048576; // 10MB in bytes

        if (file.size > maxSize) {
            formik.setFieldError(
                "termCondition",
                "File is too large. Please upload a file smaller than 10MB."
            );
            console.log("Selected file:", file);
        } else {
            setSelectedFile2(file);
            formik.setFieldValue("termCondition", file);
            console.log("Selected file:", file);
        }
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

            const updatedDealers = formik.values.dealers.map((dealer) => ({
                ...dealer,
                status: false,
            }));

            formik.setFieldValue("dealers", updatedDealers);
            formik.setFieldValue("isAccountCreate", false);
            formik.setFieldValue("customerAccountCreated", false);
        } else {
            formik.setFieldValue("isAccountCreate", true);
        }
    };

    const handleRemoveFile = () => {
        if (inputRef) {
            inputRef.current.click();
            formik.setFieldValue("termCondition", {});
            setSelectedFile2(null);
        }
    };

    const formik = useFormik({
        initialValues: initialFormValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            serviceCoverageType: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required"),
            isShippingAllowed: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required"),
            name: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required")
                .max(50, "Must be exactly 50 characters"),
            street: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required")
                .max(50, "Must be exactly 50 characters"),
            state: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required"),
            city: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required"),
            country: Yup.string().required("Required"),
            email: Yup.string()
                .matches(emailValidationRegex, "Invalid email address")
                .required("Required"),
            zip: Yup.string()
                .required("Required")
                .min(5, " Zip code must be 5-6 characters ")
                .max(6, " Zip code must be 6 characters "),
            firstName: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required")
                .max(30, "Must be exactly 30 characters"),
            lastName: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required")
                .max(30, "Must be exactly 30 characters"),
            coverageType: Yup.array().min(1, "Required"),
            phoneNumber: Yup.string()
                .required("Required")
                .min(10, "Must be at least 10 characters")
                .max(10, "Must be exactly 10 characters")
                .matches(/^[0-9]+$/, "Must contain only digits"),
            dealers: Yup.array().of(
                Yup.object().shape({
                    firstName: Yup.string()
                        .transform((originalValue) => originalValue.trim())
                        .required("Required")
                        .max(30, "Must be exactly 30 characters"),
                    lastName: Yup.string()
                        .transform((originalValue) => originalValue.trim())
                        .required("Required")
                        .max(30, "Must be exactly 30 characters"),
                    phoneNumber: Yup.string()
                        .required("Required")
                        .min(10, "Must be at least 10 characters")
                        .max(10, "Must be exactly 10 characters")
                        .matches(/^[0-9]+$/, "Must contain only digits"),
                    email: Yup.string()
                        .matches(emailValidationRegex, "Invalid email address")
                        .required("Required"),

                    status: Yup.boolean().required("Required"),
                })
            ),
            // priceBook:
            //   selectedOption === "no"
            //     ? Yup.array().notRequired()
            //     : Yup.array().of(
            //         Yup.object().shape({
            //           priceBookId: Yup.string().required("Required"),
            //           categoryId: Yup.string().required("Required"),
            //           dealerSku: Yup.string().required("Required"),
            //           retailPrice: Yup.number()
            //             .typeError("Required")
            //             .required("Required")
            //             .min(0, "Retail Price cannot be negative")
            //             .nullable(),
            //           status: Yup.boolean().required("Required"),
            //         })
            //       ),
            // file:
            //   selectedOption === "yes"
            //     ? Yup.string().notRequired()
            //     : Yup.string().required("File is required"),
        }),
        onSubmit: async (values) => {
            //     setLoading(true);
            //     values.priceBook =
            //         selectedOption === "no"
            //             ? [
            //                 {
            //                     priceBookId: "",
            //                     categoryId: "",
            //                     wholesalePrice: "",
            //                     terms: "",
            //                     description: "",
            //                     retailPrice: "",
            //                     pName: "",
            //                     status: "",
            //                 },
            //             ]
            //             : formik.errors.priceBook || values.priceBook;
            //     values.file =
            //         selectedOption === "yes" ? "" : formik.errors.file || values.file;

            //     if (formik.values.dealers.length > 0) {
            //         let emailValues = [];
            //         for (let i = 0; i < formik.values.dealers.length; i++) {
            //             const result = await checkDealerEmailAndSetError(
            //                 formik.values.dealers[i].email,
            //                 formik,
            //                 `dealers[${i}].email`
            //             );
            //             emailValues.push(result);
            //         }
            //         if (emailValues.some((value) => value === false)) {
            //             setLoading(false);

            //             return;
            //         }
            //     }
            //     console.log(values.priceBook);
            //     var valueArr = values.priceBook.map(function (item) {
            //         return item.priceBookId;
            //     });
            //     var isDuplicate = valueArr.some(function (item, idx) {
            //         return valueArr.indexOf(item) != idx;
            //     });
            //     if (isDuplicate) {
            //         setLoading(false);
            //         setMessage("PriceBook Exist with Same Name ");
            //         setIsModalOpen(true);
            //         return;
            //     }

            //     const newObject = {
            //         email: values.email,
            //         firstName: values.firstName,
            //         lastName: values.lastName,
            //         phoneNumber: values.phoneNumber,
            //         isPrimary: true,
            //         position: values.position,
            //         status: true,
            //     };
            //     values.isServicer = createServicerAccountOption;
            //     values.isShippingAllowed = shipping === "yes" ? true : false;
            //     values.customerAccountCreated =
            //         separateAccountOption === "yes" ? true : false;
            //     if (createAccountOption === "yes" || createAccountOption === "no") {
            //         values.isAccountCreate = createAccountOption === "yes" ? true : false;
            //     } else {
            //         values.isAccountCreate = createAccountOption;
            //     }

            //     const newValues = {
            //         ...values,
            //         dealers: [newObject, ...values.dealers],
            //     };

            //     const formData = new FormData();
            //     Object.entries(newValues).forEach(([key, value]) => {
            //         if (Array.isArray(value)) {
            //             value.forEach((item, index) => {
            //                 Object.entries(item).forEach(([subKey, subValue]) => {
            //                     formData.append(`${key}[${index}][${subKey}]`, subValue);
            //                 });
            //             });
            //         } else {
            //             formData.append(key, value);
            //         }
            //     });

            //     if (id !== undefined) {
            //         formData.append("dealerId", id);
            //     }

            //     const result = await addNewOrApproveDealer(formData);
            //     console.log(result);

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
        },
    });


    useEffect(() => {
        console.log("here1");
        getCovrageListData();
    }, []);


    return (
        <div className="my-8">
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
                                        <img
                                            src={Cross1}
                                            className="w-6 h-6"
                                            alt="Dropbox"
                                        />
                                    </button>
                                )}
                                {selectedFile2 ? (
                                    <p className="w-full break-words">
                                        {selectedFile2.name}
                                    </p>
                                ) : (
                                    <p
                                        className="w-full cursor-pointer"
                                        onClick={handleRemoveFile}
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
                    <div className='col-span-2 pt-1'>
                        <Button className='w-full flex'><img src={download} className='w-[20px]' alt='download' /> <span className='self-center pl-2'> Download </span> </Button>
                    </div>
                    <div className="col-span-6">
                        <p className="flex text-[12px] mb-7 font-semibold justify-between pr-4">
                            Do you want to create an account?
                            <div className='flex'>
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
                            <div className='flex'>
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

                        <div className="flex justify-between pr-4">
                            <p className=" text-[12px] mb-3 font-semibold">
                                {" "}
                                # of Claims Over the certain period
                            </p>
                            <div className="flex">

                                <RadioButton
                                    className='self-start'
                                    id="yes-warranty"
                                    label="Unlimited"
                                    value={true}
                                    checked={formik.values.isManufacturerWarranty == true}
                                    onChange={() =>
                                        formik.setFieldValue("isManufacturerWarranty", true)
                                    }
                                />
                                <RadioButton
                                    className='self-start'
                                    id="no-warranty"
                                    label="Fixed"
                                    value={false}
                                    checked={formik.values.isManufacturerWarranty === false}
                                    onChange={() =>
                                        formik.setFieldValue("isManufacturerWarranty", false)
                                    }
                                />
                            </div>
                        </div>
                        <p className="text-[12px] mb-3 font-semibold self-center mr-4">
                            # of claims in a certain period Period can be:
                        </p>
                        <div className="flex flex-wrap">
                            {/* <Select
                    name={`period`}
                    options={period}
                    className="!bg-grayf9 "
                    placeholder=""
                    className1="!pt-2.5"
                    OptionName={"Period"}
                    maxLength={"30"}
                    value={formik.values.period}
                    onBlur={formik.handleBlur}
                    onChange={handleSelectChange}
                  /> */}
                            <Select
                                name={`noOfClaim.period`}
                                options={period}
                                className="!bg-grayf9 "
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
                            {/* <div className="ml-3">
                    <Input
                      className1="!pt-2.5"
                      placeholder="# of claims"
                      type="number"
                    />
                  </div> */}
                        </div>
                    </div>
                    <div className="col-span-6">
                        <p className="flex text-[12px] mb-7 font-semibold self-center justify-between pr-4">
                            {" "}
                            <span className="mr-[0.2rem]">
                                {" "}
                                Do you want to work as a servicer?
                            </span>
                            <div className='flex'>
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
                            <div className='flex'>
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
                                    className='self-start'
                                    id="yes-warranty"
                                    label="Yes"
                                    value={true}
                                    checked={formik.values.isManufacturerWarranty == true}
                                    onChange={() =>
                                        formik.setFieldValue("isManufacturerWarranty", true)
                                    }
                                />
                                <RadioButton
                                    className='self-start'
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
                        <p className="text-base mb-3 font-semibold">Coverage Type :</p>
                        <Grid>
                            {coverage.map((type) => (
                                <div key={type._id} className="col-span-3">
                                    <div className="flex">
                                        <Checkbox
                                            name={`coverageType[${type.value}]`}
                                            checked={formik.values.coverageType.includes(
                                                type.value
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
                                                    value={
                                                        formik?.values?.adhDays?.find(
                                                            (item) => item.label === type.value
                                                        )?.value || 0
                                                    }
                                                    onBlur={formik.handleBlur}
                                                    onChange={(e) => {
                                                        const updatedadhDays =
                                                            formik?.values?.adhDays?.map((item) =>
                                                                item.label === type.value
                                                                    ? {
                                                                        ...item,
                                                                        value: Number(e.target.value),
                                                                    }
                                                                    : item
                                                            );
                                                        formik.setFieldValue("adhDays", updatedadhDays);
                                                    }}
                                                />
                                            </div>

                                            <Input
                                                type="number"
                                                name={`adhDays[${type.value}].value1`}
                                                label={`Deduction  ($)`}
                                                className="!bg-white "
                                                value={
                                                    formik?.values?.adhDays?.find(
                                                        (item) => item.label === type.value
                                                    )?.value1 || 0
                                                }
                                                onBlur={formik.handleBlur}
                                                onChange={(e) => {
                                                    const updatedadhDays =
                                                        formik?.values?.adhDays?.map((item) =>
                                                            item.label === type.value
                                                                ? {
                                                                    ...item,
                                                                    value1: Number(e.target.value),
                                                                }
                                                                : item
                                                        );
                                                    formik.setFieldValue("adhDays", updatedadhDays);
                                                }}
                                            />
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

                <div className='text-left my-5'>
                    <Button>Submit</Button>
                </div>
            </Card>
        </div>
    )
}

export default Setting
