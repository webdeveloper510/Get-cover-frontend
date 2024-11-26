import React, { useEffect, useRef, useState } from "react";
import Grid from "../../../../common/grid";
import Select from "../../../../common/select";
import Input from "../../../../common/input";
import Card from "../../../../common/card";
import Primary from "../../../../assets/images/SetPrimary.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../../../common/button";
import star from "../../../../assets/images/icons/star.svg";
import shorting from "../../../../assets/images/icons/shorting.svg";
import { RotateLoader } from "react-spinners";
import Modal from "../../../../common/model";
import { cityData } from "../../../../stateCityJson";
import delete1 from "../../../../assets/images/delete.png";
import edit from "../../../../assets/images/edit-text.png";
import DataTable from "react-data-table-component";
import ActiveIcon from "../../../../assets/images/icons/iconAction.svg";
import { deleteCustomerAddress, editCustomerAddressById, getCustomerDetailsById } from "../../../../services/customerServices";
import textFile from "../../../../common/textFile";
import InActiveButton from "../../../../common/inActiveButton";
import SingleView from "../../../../common/singleView";

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
    const [editLoading, setEditLoading] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState({
        address: "",
        addressId: "",
        city: "",
        state: "",
        zip: "",
    });
    const dropdownRef = useRef(null);
    const state = cityData;

    useEffect(() => {
        if (props.activeTab === "Settings") {
            customerDetails(props.id);
        }
    }, [props]);

    useEffect(() => {

        let intervalId;
        if (isModalOpen && timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0) {
            closeModal();
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

    const formik = useFormik({
        initialValues: initialFormValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            address: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required")
                .max(500, "Must be exactly 500 characters"),
            state: Yup.string()
                .required("Required"),
            city: Yup.string()
                .transform((originalValue) => originalValue.trim())
                .required("Required"),
            zip: Yup.string()
                .required("Required")
                .min(5, "Must be at least 5 characters")
                .max(6, "Must be exactly 6 characters"),
        }),
        onSubmit: async (values) => {
            setEditLoading(true);
            localStorage.setItem("customer", "Settings");
            console.log(values)
            const data = {
                customerId: props.id,
                addressId: values.addressId,
                city: values.city,
                street: values.address,
                state: values.state,
                zip: values.zip
            };
            try {
                const result = await editCustomerAddressById(
                    data);
                console.log(result);
                SetPrimaryText("Address Updated Successfully");
                SetSecondaryText("Address updated successfully");
                SetIsModalOpen(true);
                setIsUserModalOpen(false);
                formik.resetForm();
                customerDetails(props.id)
                localStorage.setItem("customer", "Settings");
                setTimer(3);
            } catch (error) {
                console.error("Error updating Customer address:", error);
                SetPrimaryText("Error Updating Customer address");
                SetSecondaryText(
                    "There was an error updating the Customer address. Please try again."
                );
                SetIsModalOpen(true);
            } finally {
                setEditLoading(false);
            }
        },
    });
    const customerDetails = async (id) => {
        setLoading(true);
        localStorage.setItem("customer", "Settings");
        console.log(id, 'result--------------------');
        const result = await getCustomerDetailsById(id);
        console.log(result, 'result--------------------');
        setAddressData(result.result?.meta?.addresses)
        setLoading(false);
    }

    const handleSelectChange = async (name, selectedValue) => {
        formik.setFieldValue(name, selectedValue);
    };

    const deleteAddress = async (id, customerId) => {
        setLoading(true);
        localStorage.setItem("customer", "Settings");
        const result = await deleteCustomerAddress(id, customerId)
        if (result.code === 200) {
            SetPrimaryText("Address Deleted Successfully");
            SetSecondaryText("Address deleted successfully");
            SetIsModalOpen(true);
            setTimer(3);
            localStorage.setItem("customer", "Settings");

        } else {
            console.error("Error deleting Customer address:", result.message);
            SetPrimaryText("Error deleting Customer address");
            SetSecondaryText(
                "There was an error deleting the Customer address. Please try again."
            );
            SetIsModalOpen(true);
        }
        setLoading(false);
    }

    const handleDownload = () => {
        console.log("Download");
        textFile(addressData);
    };

    const [currentPage, setCurrentPage] = useState(1); // Tracks current page
    const [rowsPerPage, setRowsPerPage] = useState(10); // Tracks rows per page

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage);
        setCurrentPage(page);
    };


    const Address = [
        {
            name: "Serial #",
            cell: (row, index) => (
                <div className="flex relative">
                    {row.isPrimary && (
                        <img src={star} alt="" className="absolute -left-3 top-0" />
                    )}
                    <span className="self-center pt-2 ml-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                    </span>
                </div>
            ),
            // selector: (row, index) =>
            sortable: true,
            style: { whiteSpace: "pre-wrap" },
        },
        {
            name: "Street Address",
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
                            <SingleView
                                ref={dropdownRef}
                                onClick={() => setSelectedAction(null)}
                                className={`absolute z-[2] w-[100px] drop-shadow-5xl -right-3 mt-2 py-1 border rounded-lg shadow-md top-[1rem]`}
                            >
                                <>
                                    <div>
                                        <div
                                            className="text-left cursor-pointer flex border-b hover:font-semibold py-1 px-2"
                                            onClick={() => openUserModal(row)}
                                        >
                                            <div
                                                style={{
                                                    maskImage: `url(${edit})`,
                                                    WebkitMaskImage: `url(${edit})`,
                                                    maskRepeat: "no-repeat",
                                                    WebkitMaskRepeat: "no-repeat",
                                                    maskPosition: "center",
                                                    WebkitMaskPosition: "center",
                                                    maskSize: "contain",
                                                    WebkitMaskSize: "contain",
                                                }}
                                                className="self-center singleViews mr-2 h-4 w-4 "
                                            />
                                            {/* <img src={edit} className="w-4 h-4 mr-2" />{" "} */}
                                            <span className="self-center">Edit </span>
                                        </div>
                                        <div className="text-left cursor-pointer flex hover:font-semibold py-1 px-2" onClick={() => deleteAddress(row._id, props.id)}
                                        >
                                            <div
                                                style={{
                                                    maskImage: `url(${delete1})`,
                                                    WebkitMaskImage: `url(${delete1})`,
                                                    maskRepeat: "no-repeat",
                                                    WebkitMaskRepeat: "no-repeat",
                                                    maskPosition: "center",
                                                    WebkitMaskPosition: "center",
                                                    maskSize: "contain",
                                                    WebkitMaskSize: "contain",
                                                }}
                                                className="self-center singleViews mr-2 h-4 w-4 "
                                            />
                                            {/* <img src={delete1} className="w-4 h-4 mr-2" /> */}
                                            <span className="self-center">Delete</span>
                                        </div>

                                    </div>
                                </>
                            </SingleView>
                        )
                        }
                    </div >
                );
            },
        },
    ];

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        formik.resetForm();
    };

    const openUserModal = (data) => {
        console.log(data);
        setInitialFormValues({
            addressId: data._id,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
        }
        )
        setIsUserModalOpen(true);
    };

    const CustomNoDataComponent = () => (
        <Card className="text-center my-5">
            <p>No records found.</p>
        </Card>
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
                    <Card className="bg-white mt-4 border-[1px] border-Light-Grey rounded-xl p-5 ">
                        <div className="">
                            <Grid>
                                <div className="col-span-7 self-center">
                                    <p className="text-lg font-semibold">Customer Address Details </p>
                                </div>
                                {addressData.length > 0 && <div className="col-span-5 self-center text-end">
                                    <Button onClick={() => handleDownload()}>Export Addresses</Button>
                                </div>}

                            </Grid>
                            <DataTable
                                columns={Address}
                                data={addressData}
                                sortIcon={
                                    <>
                                        {" "}
                                        <div
                                            style={{
                                                maskImage: `url(${shorting})`,
                                                WebkitMaskImage: `url(${shorting})`,
                                                maskRepeat: "no-repeat",
                                                WebkitMaskRepeat: "no-repeat",
                                                maskPosition: "center",
                                                WebkitMaskPosition: "center",
                                                maskSize: "contain",
                                                WebkitMaskSize: "contain",
                                            }}
                                            className="ml-2 tabless"
                                        />
                                        {/* <img
                                            src={shorting}
                                            className="ml-2"
                                            alt="shorting"
                                        />{" "} */}
                                    </>
                                }
                                highlightOnHover
                                draggableColumns={false}
                                pagination
                                paginationPerPage={rowsPerPage}
                                paginationComponentOptions={{
                                    rowsPerPageText: "Rows per page:",
                                    rangeSeparatorText: "of",


                                }}
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handleRowsPerPageChange}
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
                {editLoading ? (
                    <div className=" h-[400px] w-full flex py-5">
                        <div className="self-center mx-auto">
                            <RotateLoader color="#333" />
                        </div>
                    </div>) :
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
                    </div>}

            </Modal>
        </>
    );
}



export default CustomerSetting
