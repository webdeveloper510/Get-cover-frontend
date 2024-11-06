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
import shorting from "../../../../assets/images/icons/shorting.svg";
import AddItem from "../../../../assets/images/icons/addItem.svg";
import {
    editDealerSettings,
    uploadTermsandCondition,
} from "../../../../services/dealerServices";
import { RotateLoader } from "react-spinners";
import Modal from "../../../../common/model";
import { cityData } from "../../../../stateCityJson";
import delete1 from "../../../../assets/images/delete.png";
import edit from "../../../../assets/images/edit-text.png";
import DataTable from "react-data-table-component";
import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import { getCustomerDetailsById } from "../../../../services/customerServices";

function CustomerSetting(props) {
    console.log("i am looking for this ", props);
    const [isModalOpen, SetIsModalOpen] = useState(false);
    const [timer, setTimer] = useState(3);
    const [addressData, setAddressData] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [primaryText, SetPrimaryText] = useState("");
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [secondaryText, SetSecondaryText] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        address: "",
        city: "",
        state: "",
        zip: "",
    });
    const dropdownRef = useRef(null);
    const state = cityData;
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

    const getCovrageListData = async () => {
        try {
            const res = await getCovrageList();
            console.log(res.result.value);
        } catch (error) {
            console.error("Error fetching category list:", error);
        }
    };

    const formik = useFormik({
        initialValues: initialFormValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
        }),
        onSubmit: async (values) => {
            setLoading(true);

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
    const customerDetails = async (id) => {
        setLoading(true);
        console.log(id, 'result--------------------');
        const result = await getCustomerDetailsById(id);
        console.log(result, 'result--------------------');
        setAddressData(result.result.meta?.addresses)
        setLoading(false);
    }
    useEffect(() => {
        customerDetails(props.id);
        getCovrageListData();
    }, []);
    const handleSelectChange = async (name, selectedValue) => {
        formik.setFieldValue(name, selectedValue);
    };

    const Address = [
        {
            name: "S.#",
            selector: (row, index) => index + 1,
            sortable: true,
            style: { whiteSpace: "pre-wrap" },
        },
        {
            name: "Address",
            selector: (row) => row.address,
            sortable: true,
            style: { whiteSpace: "pre-wrap" },
        },
        {
            name: "City",
            selector: (row) => row.city,
            sortable: true,
            style: { whiteSpace: "pre-wrap" },
        },
        {
            name: "State",
            selector: (row) => row?.state,
            sortable: true,
            style: { whiteSpace: "pre-wrap" },
        },
        {
            name: "Zip",
            selector: (row) => row?.zip,
            sortable: true,
            style: { whiteSpace: "pre-wrap" },
        },
        {
            name: "Action",
            minWidth: "auto",
            maxWidth: "80px",
            cell: (row, index) => {
                // console.log(index, index % 10 == 9)
                return (
                    <div className="relative">
                        <div
                            onClick={() =>
                                setSelectedAction(
                                    selectedAction === index ? null : index
                                )
                            }
                        >
                            <img
                                src={ActiveIcon}
                                className="cursor-pointer w-[35px]"
                                alt="Active Icon"
                            />
                        </div>
                        {selectedAction === index && (
                            <div
                                ref={dropdownRef}
                                onClick={() => setSelectedAction(null)}
                                className={`absolute z-[2] w-[100px] drop-shadow-5xl -right-3 mt-2 py-1 bg-white border rounded-lg shadow-md top-[1rem]`}
                            >
                                <>
                                    <div>
                                        <div
                                            className="text-left cursor-pointer flex border-b hover:font-semibold py-1 px-2"
                                        >
                                            <img src={edit} className="w-4 h-4 mr-2" />{" "}
                                            <span className="self-center">Edit </span>
                                        </div>
                                        <div className="text-left cursor-pointer flex hover:font-semibold py-1 px-2"
                                        >
                                            <img src={delete1} className="w-4 h-4 mr-2" />
                                            <span className="self-center">Delete</span>
                                        </div>

                                    </div>
                                </>
                            </div>
                        )
                        }
                    </div >
                );
            },
        },
    ];
    // const addressData = [
    //     {
    //         id: 1,
    //         address: "123 Main St",
    //         city: "Los Angeles",
    //         state: "CA",
    //         zip: "90001",
    //     },
    //     {
    //         id: 2,
    //         address: "456 Elm St",
    //         city: "New York",
    //         state: "NY",
    //         zip: "10001",
    //     },
    //     {
    //         id: 3,
    //         address: "789 Maple Ave",
    //         city: "Chicago",
    //         state: "IL",
    //         zip: "60601",
    //     },
    //     {
    //         id: 4,
    //         address: "321 Oak St",
    //         city: "Houston",
    //         state: "TX",
    //         zip: "77001",
    //     },
    //     {
    //         id: 5,
    //         address: "654 Pine Rd",
    //         city: "Phoenix",
    //         state: "AZ",
    //         zip: "85001",
    //     },
    // ];

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        formik.resetForm();
    };

    const CustomNoDataComponent = () => (
        <div className="text-center my-5">
            <p>No records found.</p>
        </div>
    );

    const paginationOptions = {
        rowsPerPageText: "Rows per page:",
        rangeSeparatorText: "of",
    };

    return (
        <>
            {loading ? (
                <div className=" h-[400px] w-full flex py-5">
                    <div className="self-center mx-auto">
                        <RotateLoader color="#333" />
                    </div>
                </div>
            ) : (
                <div className="my-8 relative users">
                    <Card className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl p-5 ">
                        <div className="my-3">
                            <p className="text-lg font-semibold">Customer Address Details : </p>
                            <DataTable
                                columns={Address}
                                data={addressData}
                                sortIcon={
                                    <>
                                        {" "}
                                        <img
                                            src={shorting}
                                            className="ml-2"
                                            alt="shorting"
                                        />{" "}
                                    </>
                                }
                                highlightOnHover
                                draggableColumns={false}
                                pagination
                                paginationPerPage={10}
                                paginationComponentOptions={paginationOptions}
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                noDataComponent={<CustomNoDataComponent />}
                            />
                        </div>
                    </Card>
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

            <Modal isOpen={isUserModalOpen} onClose={closeUserModal}>
                <div className=" py-3">
                    <p className=" text-center text-3xl mb-5 mt-2 font-bold text-light-black">
                        Edit Address
                    </p>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid className="px-8">
                            <div className="col-span-12">
                                <Input
                                    type="text"
                                    name="address"
                                    label="Street Address"
                                    className="!bg-white"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={loading}
                                />
                                {formik.touched.address &&
                                    formik.errors.address && (
                                        <p className="text-red-500 text-xs pl-2">
                                            {formik.errors.address}
                                        </p>
                                    )}
                            </div>
                            <div className="col-span-4">
                                <Input
                                    type="text"
                                    name="city"
                                    label="City"
                                    className="!bg-white"
                                    placeholder=" "
                                    maxLength={"20"}
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.city && formik.errors.city}
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <div className="text-red-500 text-sm pl-2 pt-2">
                                        {formik.errors.city}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-4">
                                <Select
                                    label="State"
                                    name="state"
                                    placeholder=""
                                    className="!bg-white"
                                    onChange={handleSelectChange}
                                    options={state}
                                    value={formik.values.state}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.state && formik.errors.state}
                                />
                                {formik.touched.state && formik.errors.state && (
                                    <div className="text-red-500 text-sm pl-2 pt-2">
                                        {formik.errors.state}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-4">
                                <Input
                                    type="number"
                                    name="zip"
                                    label="Zipcode"
                                    className="!bg-white"
                                    placeholder=""
                                    zipcode={true}
                                    value={formik.values.zip}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    minLength={"5"}
                                    maxLength={"6"}
                                    error={formik.touched.zip && formik.errors.zip}
                                />
                                {formik.touched.zip && formik.errors.zip && (
                                    <div className="text-red-500 text-sm pl-2 pt-2">
                                        {formik.errors.zip}
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid className="drop-shadow-5xl px-8 mt-8">
                            <div className="col-span-4">
                                <Button
                                    type="button"
                                    className="border w-full !border-Bright-Grey !bg-[transparent] !text-light-black !text-sm !font-Regular"
                                    onClick={closeUserModal}
                                >
                                    Cancel
                                </Button>
                            </div>
                            <div className="col-span-8">
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>
                            </div>
                        </Grid>
                    </form>
                </div>
            </Modal>
        </>
    );
}



export default CustomerSetting
