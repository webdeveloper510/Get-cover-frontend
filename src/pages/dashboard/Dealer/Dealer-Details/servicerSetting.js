import React, { useEffect, useRef, useState } from "react";
import Grid from "../../../../common/grid";
import Select from "../../../../common/select";
import RadioButton from "../../../../common/radio";
import Checkbox from "../../../../common/checkbox";
import Input from "../../../../common/input";
import Card from "../../../../common/card";
import Primary from "../../../../assets/images/SetPrimary.png";
import Cross1 from "../../../../assets/images/Cross_Button.png";
import assign from "../../../../assets/images/Unassign.png";
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
import CollapsibleDiv from "../../../../common/collapsibleDiv";
import { dealerGetSetting, dealerResetDefault, dealerSaveSetting, getSetting, resetDefault, resetSetting, saveSetting, servicerGetSetting, servicerResetDefault, servicerResetSetting, servicerSaveSetting, uploadFile } from "../../../../services/extraServices";
import InActiveButton from "../../../../common/inActiveButton";
import SingleView from "../../../../common/singleView";

function ServicerSetting(props) {
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
    const closeDefalt = () => {
        setIsSetDefalt(false);
    };
    const [isShow, setIsShow] = useState("no");
    const [sideBarColor, setSideBarColor] = useState('');
    const [sideBarTextColor, setSideBarTextColor] = useState('');
    const [sideBarButtonColor, setSideBarButtonColor] = useState('');
    const [sideBarButton2ndColor, setSideBarButton2ndColor] = useState('');
    const [sideBarButtonTextColor, setSideBarButtonTextColor] = useState('');
    const [buttonColor, setButtonColor] = useState('');
    const [buttonTextColor, setButtonTextColor] = useState('');
    const [chartFirstColor, setChartFirstColor] = useState('');
    const [chartSecondColor, setChartSecondColor] = useState('');
    const [backGroundColor, setBackGroundColor] = useState('');
    const [modelBackgroundColor, setModelBackgroundColor] = useState('');
    const [inActiveButtonBackgroundColor, setInActiveButtonBackgroundColor] = useState('');
    const [inActiveButtonColor, setInActiveButtonColor] = useState('');
    const [modelColor, setModelColor] = useState('');
    const [cardBackGroundColor, setCardBackGroundColor] = useState('');
    const [cardColor, setCardColor] = useState('');
    const [textColor, setTextColor] = useState('');
    const [titleColor, setTitleColor] = useState('');
    const [defaults, setDefaults] = useState(true);
    const [lastMessage, setLastMessage] = useState("");
    const [selectedFile1, setSelectedFile1] = useState();
    const [selectedFile3, setSelectedFile3] = useState();
    const [isSetDefalt, setIsSetDefalt] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const handleColorChange = (field, setter) => (event) => {
        const newColor = event.target.value;
        setter(newColor);
        siteChange.setFieldValue(field, newColor);
        setDefaults(false);
    };

    useEffect(() => {
        let intervalId;

        if (isModalOpen && timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0) {
            closeModal();
            // window.location.reload();
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
        fetchColorDetails12();
        setLoading1(false);
    }, [props]);

    const handleDefault = async (id) => {
        setIsSetDefalt(false);
        setLoading(true);
        try {
            const data = await servicerResetDefault(id);
            SetPrimaryText(" Successfully ");
            SetSecondaryText("Default color set successfully ");
            SetIsModalOpen(true);
            setLoading(false);
            setTimer(3);
            // setTimeout(() => {
            //   window.location.reload();
            // }, 3000);
            setLoading(false);
        } catch (error) {
            SetPrimaryText(" Error ");
            SetSecondaryText(error.message);
            SetIsModalOpen(true);
            console.error('Error Default settings:', error);
            setLoading(false);
        }
        setLoading(false);
    };
    const handleFileChange = (event, setterFunction, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            uploadFile(formData).then((res) => {
                console.log("API response:", res);
                if (res && res.result) {
                    siteChange.setFieldValue(fieldName, res.result);
                    setterFunction(res.result);
                } else {
                    console.error("Unexpected response format:", res);
                }
            }).catch((error) => {
                console.error("Error uploading file:", error);
            });
        }
    };

    const handleRemoveFile = (inputRef, setFieldValue, fieldName, setFileState) => {

        // Ensure all parameters are valid
        if (inputRef?.current) {
            // Reset the form field value in Formik
            setFieldValue(fieldName, undefined);

            // Clear the input field
            inputRef.current.value = "";

            // Reset the file state
            setFileState(undefined);
        } else {
            console.error("Invalid inputRef or other parameters.");
        }
    };


    const handleRadioChange1 = (event) => {
        const selectedValue = event.target.value;
        setIsShow(selectedValue);

        if (selectedValue === "no") {
            siteChange.setFieldValue("isWhiteLabelShow", false);
        } else {
            siteChange.setFieldValue("isWhiteLabelShow", true);
        }
    };

    const siteChange = useFormik({
        initialValues: {
            favIcon: selectedFile3,
            logoImage: selectedFile1,
            chartFirstColor: chartFirstColor,
            chartSecondColor: chartSecondColor,
            sideBarButton2ndColor: sideBarButton2ndColor,
            sideBarColor: sideBarColor,
            sideBarTextColor: sideBarTextColor,
            sideBarButtonColor: sideBarButtonColor,
            sideBarButtonTextColor: sideBarButtonTextColor,
            buttonColor: buttonColor,
            buttonTextColor: buttonTextColor,
            backGroundColor: backGroundColor,
            textColor: textColor,
            titleColor: titleColor,
            modelColor: modelColor,
            modelBackgroundColor: modelBackgroundColor,
            cardBackGroundColor: cardBackGroundColor,
            cardColor: cardColor,
            inActiveButtonBackgroundColor: inActiveButtonBackgroundColor,
            inActiveButtonColor: inActiveButtonColor,
            isWhiteLabelShow: isShow
        },
        validationSchema: Yup.object({
            favIcon: Yup.mixed().nullable(),
        }),
        onSubmit: async (values) => {

            try {
                setLoading(true);
                const colorScheme = [
                    { colorCode: values.chartFirstColor || chartFirstColor, colorType: "chartFirstColor" },
                    { colorCode: values.sideBarColor || sideBarColor, colorType: "sideBarColor" },
                    { colorCode: values.sideBarTextColor || sideBarTextColor, colorType: "sideBarTextColor" },
                    { colorCode: values.sideBarButton2ndColor || sideBarButton2ndColor, colorType: "sideBarButton2ndColor" },
                    { colorCode: values.sideBarButtonColor || sideBarButtonColor, colorType: "sideBarButtonColor" },
                    { colorCode: values.sideBarButtonTextColor || sideBarButtonTextColor, colorType: "sideBarButtonTextColor" },
                    { colorCode: values.buttonColor || buttonColor, colorType: "buttonColor" },
                    { colorCode: values.buttonTextColor || buttonTextColor, colorType: "buttonTextColor" },
                    { colorCode: values.backGroundColor || backGroundColor, colorType: "backGroundColor" },
                    { colorCode: values.textColor || textColor, colorType: "textColor" },
                    { colorCode: values.titleColor || titleColor, colorType: "titleColor" },
                    { colorCode: values.cardColor || cardColor, colorType: "cardColor" },
                    { colorCode: values.cardBackGroundColor || cardBackGroundColor, colorType: "cardBackGroundColor" },
                    { colorCode: values.modelBackgroundColor || modelBackgroundColor, colorType: "modelBackgroundColor" },
                    { colorCode: values.modelColor || modelColor, colorType: "modelColor" },
                    { colorCode: values.inActiveButtonBackgroundColor || inActiveButtonBackgroundColor, colorType: "inActiveButtonBackgroundColor" },
                    { colorCode: values.inActiveButtonColor || inActiveButtonColor, colorType: "inActiveButtonColor" }
                ];
                const apiData = {
                    servicerId: props.id,
                    favIcon: values.favIcon || selectedFile3,
                    colorScheme: colorScheme,
                    logoLight: values.logoLight || selectedFile1,
                    logoDark: values.logoDark || selectedFile,
                    isWhiteLabelShow: values.isWhiteLabelShow || isShow
                };
                console.log(apiData);
                const result = await servicerSaveSetting(apiData);

                SetPrimaryText("Site Setting Updated Successfully ");
                SetSecondaryText("site setting updated successfully ");
                setLastMessage("site will be reloaded after setting has been updated successfully");
                SetIsModalOpen(true);
                setTimer(3);
                fetchColorDetails12();
                // setTimeout(() => {
                //   window.location.reload()
                // }, 3000);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        },
    });
    const fetchColorDetails12 = async () => {
        console.log('Fetching color details', props?.id);
        try {
            const userDetails = await servicerGetSetting(props.id);
            console.log(userDetails);

            if (userDetails.result && userDetails.result[0].colorScheme) {
                const colorScheme = userDetails.result[0].colorScheme;
                colorScheme?.forEach(color => {
                    switch (color.colorType) {
                        case 'chartFirstColor':
                            setChartFirstColor(color.colorCode);
                            break;
                        case 'chartSecondColor':
                            setChartSecondColor(color.colorCode);
                            break;
                        case 'sideBarColor':
                            setSideBarColor(color.colorCode);
                            break;
                        case 'sideBarTextColor':
                            setSideBarTextColor(color.colorCode);
                            break;
                        case 'sideBarButtonColor':
                            setSideBarButtonColor(color.colorCode);
                            break;
                        case 'sideBarButton2ndColor':
                            setSideBarButton2ndColor(color.colorCode);
                            break;
                        case 'sideBarButtonTextColor':
                            setSideBarButtonTextColor(color.colorCode);
                            break;
                        case 'buttonColor':
                            setButtonColor(color.colorCode);
                            break;
                        case 'buttonTextColor':
                            setButtonTextColor(color.colorCode);
                            break;
                        case 'backGroundColor':
                            setBackGroundColor(color.colorCode);
                            break;
                        case 'textColor':
                            setTextColor(color.colorCode);
                            break;
                        case 'titleColor':
                            setTitleColor(color.colorCode);
                            break;
                        case 'cardColor':
                            setCardColor(color.colorCode);
                            break;
                        case 'cardBackGroundColor':
                            setCardBackGroundColor(color.colorCode);
                            break;
                        case 'modelBackgroundColor':
                            setModelBackgroundColor(color.colorCode);
                            break;
                        case 'modelColor':
                            setModelColor(color.colorCode);
                            break;
                        case 'inActiveButtonBackgroundColor':
                            setInActiveButtonBackgroundColor(color.colorCode);
                            break;
                        case 'inActiveButtonColor':
                            setInActiveButtonColor(color.colorCode);
                            break;
                        default:
                            break;
                    }
                });
            }
            if (userDetails && userDetails.result) {
                setSelectedFile3(userDetails.result[0].favIcon || null);
                setSelectedFile1(userDetails.result[0].logoLight || null);
                setSelectedFile(userDetails.result[0].logoDark || null);
                setDefaults(userDetails.result[0].setDefault === 0 ? true : false);
                setIsShow(userDetails.result[0].isWhiteLabelShow === true ? 'yes' : 'no');

            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };
    const handleReset = async (id) => {
        setLoading(true);
        try {
            const data = await servicerResetSetting(id);
            console.log(data)

            SetPrimaryText("Site Setting Reset Successfully ");
            SetSecondaryText("Site setting Reset successfully ");
            setLastMessage("Site will be reloaded after setting has been reset successfully");
            SetIsModalOpen(true);
            setTimer(3);
            fetchColorDetails12();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 3000);
            setLoading(false);
        } catch (error) {
            console.error('Error resetting settings:', error);
            setLoading(false);
        }
        setLoading(false);
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
                <div className="my-8">
                    <Card className="bg-white mt-6 border-[1px] border-Light-Grey rounded-xl p-5">
                        <p className="text-lg font-bold mb-3">  White Label Setting</p>
                        <form onSubmit={siteChange.handleSubmit}>

                            <Grid container spacing={2} className="py-8 px-4">
                                <div className="col-span-4">
                                    <div className="relative">
                                        <label
                                            htmlFor="favicon-upload"
                                            className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                                        >
                                            Favicon Upload
                                        </label>
                                        <input
                                            type="file"
                                            id="favicon-upload"
                                            name="favIcon"
                                            className="hidden"
                                            onChange={(event) => handleFileChange(event, setSelectedFile3, "favIcon")}
                                            ref={inputRef2}
                                        />

                                        <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-white rounded-lg border-[1px] border-gray-300 appearance-none text-light-black peer">
                                            {selectedFile3 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(setSelectedFile3, "favIcon")}
                                                    className="absolute -right-2 -top-2 mx-auto mb-3"
                                                >
                                                    <img src={Cross1} className="w-6 h-6" alt="Remove" />
                                                </button>
                                            )}
                                            {selectedFile3 ? (
                                                <p className="w-full break-words">{selectedFile3.name}</p>
                                            ) : (
                                                <p
                                                    className="w-full cursor-pointer"
                                                    onClick={() => inputRef2.current.click()}
                                                >
                                                    Select File
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[12px]">The image size should be 50x50 px for the best display.</p>
                                    </div>
                                    <img src={`${selectedFile3?.baseUrl}uploads/logo/${encodeURIComponent(selectedFile3?.fileName)}`} className="upload w-[100px] h-[50px] mt-2 mr-auto object-contain	" alt="favicon" />
                                </div>
                                <div className="col-span-4 mb-2">
                                    <div className="relative">
                                        <label
                                            htmlFor="logo-upload"
                                            className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                                        >
                                            Light Logo Upload
                                        </label>
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            name="logoImage"
                                            className="hidden"
                                            onChange={(event) => handleFileChange(event, setSelectedFile1, "logoLight")}
                                            ref={inputRef1}
                                        />
                                        <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-white rounded-lg border-[1px] border-gray-300 appearance-none text-light-black peer">
                                            {selectedFile1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(setSelectedFile1, "logoLight")}
                                                    className="absolute -right-2 -top-2 mx-auto mb-3"
                                                >
                                                    <img src={Cross1} className="w-6 h-6" alt="Remove" />
                                                </button>
                                            )}
                                            {selectedFile1 ? (
                                                <p className="w-full break-words">{selectedFile1.name}</p>
                                            ) : (
                                                <p
                                                    className="w-full cursor-pointer"
                                                    onClick={() => inputRef1.current.click()}
                                                >
                                                    Select File
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[12px]">The image size should be 150x50 px for the best display.</p>
                                    </div>
                                    <img src={`${selectedFile1?.baseUrl}uploads/logo/${encodeURIComponent(selectedFile1?.fileName)}`} style={{ backgroundColor: sideBarColor }} className={`upload w-[100px] mt-2 mr-auto object-contain`} alt="favicon" />
                                </div>
                                <div className="col-span-4">
                                    <div className="relative">
                                        <label
                                            htmlFor="favicon-upload"
                                            className="absolute text-base font-Regular text-[#5D6E66] leading-6 duration-300 transform origin-[0] top-1 bg-white left-2 px-1 -translate-y-4 scale-75"
                                        >
                                            Dark Logo Upload
                                        </label>
                                        <input
                                            type="file"
                                            id="favicon-upload"
                                            name="favIcon"
                                            className="hidden"
                                            onChange={(event) => handleFileChange(event, setSelectedFile, "logoDark")}
                                            ref={inputRef3}
                                        />
                                        <div className="block px-2.5 pb-2.5 pt-4 w-full text-base font-semibold bg-white rounded-lg border-[1px] border-gray-300 appearance-none text-light-black peer">
                                            {selectedFile && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(setSelectedFile, "logoDark")}
                                                    className="absolute -right-2 -top-2 mx-auto mb-3"
                                                >
                                                    <img src={Cross1} className="w-6 h-6" alt="Remove" />
                                                </button>
                                            )}
                                            {selectedFile ? (
                                                <p className="w-full break-words">{selectedFile.name}</p>
                                            ) : (
                                                <p
                                                    className="w-full cursor-pointer"
                                                    onClick={() => inputRef3.current.click()}
                                                >
                                                    Select File
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[12px]">The image size should be 150x50 px for the best display.</p>
                                    </div>
                                    <img src={`${selectedFile?.baseUrl}uploads/logo/${encodeURIComponent(selectedFile?.fileName)}`} className="upload w-[100px] mt-2 object-contain mr-auto" alt="favicon" />
                                </div>
                                <div className="col-span-12">
                                    <p className="mb-3 font-bold">Color Setting </p>
                                    <Grid >
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`chartFirstColor`}
                                                tooltip="15"
                                                className="!bg-white flex w-full"
                                                content='You can change website chart start color here.'
                                                className1="h-11 "
                                                label="Gradient Start Color "
                                                placeholder=""
                                                value={chartFirstColor} onChange={handleColorChange('chartFirstColor', setChartFirstColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`chartSecondColor`}
                                                tooltip="15"
                                                className="!bg-white flex w-full"
                                                content='You can change website chart end color here.'
                                                className1="h-11 "
                                                label="Gradient End Color "
                                                placeholder=""
                                                value={chartSecondColor} onChange={handleColorChange('chartSecondColor', setChartSecondColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`sideBarColor`}
                                                className1="h-11"
                                                tooltip="1"
                                                className="!bg-white  flex w-full"
                                                content='You can change the theme background color here.'
                                                label="Theme Color"
                                                placeholder=""
                                                value={sideBarColor} onChange={handleColorChange('sideBarColor', setSideBarColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`sideBarTextColor`}
                                                className1="h-11"
                                                tooltip="2"
                                                className="!bg-white flex !w-[111%]"
                                                content='You can change the theme text color here.'
                                                label="Theme Text Color"
                                                placeholder=""
                                                value={sideBarTextColor} onChange={handleColorChange('sideBarTextColor', setSideBarTextColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`sideBarButtonColor`}
                                                tooltip="3"
                                                className="!bg-white flex w-full"
                                                content='You can change active page button start background color here.'
                                                className1="h-11"
                                                label="SideBar Gradient Start Button "
                                                placeholder=""
                                                value={sideBarButtonColor} onChange={handleColorChange('sideBarButtonColor', setSideBarButtonColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`sideBarButtonColor`}
                                                tooltip="23"
                                                className="!bg-white flex !w-[111%]"
                                                content='You can change active page button end background color here.'
                                                className1="h-11"
                                                label="SideBar Gradient End Button "
                                                placeholder=""
                                                value={sideBarButton2ndColor} onChange={handleColorChange('sideBarButton2ndColor', setSideBarButton2ndColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`sideBarButtonTextColor`}
                                                tooltip="4"
                                                className="!bg-white flex !w-[111%]"
                                                content='You can change the sideBar active page button text color here.'
                                                className1="h-11"
                                                label="SideBar Text Button "
                                                placeholder=""
                                                value={sideBarButtonTextColor} onChange={handleColorChange('sideBarButtonTextColor', setSideBarButtonTextColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`buttonColor`}
                                                tooltip="5"
                                                className="!bg-white flex w-full"
                                                content='You can change all button background color here.'
                                                className1="h-11"
                                                label="Button Background Color"
                                                placeholder=""
                                                value={buttonColor} onChange={handleColorChange('buttonColor', setButtonColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`buttonTextColor`}
                                                tooltip="6"
                                                className="!bg-white flex !w-[111%]"
                                                content='You can change all button text color here.'
                                                className1="h-11"
                                                label="Button Text Color"
                                                placeholder=""
                                                value={buttonTextColor} onChange={handleColorChange('buttonTextColor', setButtonTextColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`backGroundColor`}
                                                tooltip="7"
                                                className="!bg-white flex !w-[111%]"
                                                content='You can change all backGround color here.'
                                                className1="h-11"
                                                label="Background Color"
                                                placeholder=""
                                                value={backGroundColor} onChange={handleColorChange('backGroundColor', setBackGroundColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`titleColor`}
                                                tooltip="8"
                                                className="!bg-white flex w-full"
                                                content='You can change website text color here.'
                                                className1="h-11"
                                                label="Text Color"
                                                placeholder=""
                                                value={titleColor} onChange={handleColorChange('titleColor', setTitleColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`cardBackGroundColor`}
                                                tooltip="10"
                                                className="!bg-white flex w-full"
                                                content='You can change website box backGround color here.'
                                                className1="h-11"
                                                label="Box Color"
                                                placeholder=""
                                                value={cardBackGroundColor} onChange={handleColorChange('cardBackGroundColor', setCardBackGroundColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`cardColor`}
                                                tooltip="9"
                                                className="!bg-white flex w-full"
                                                content='You can change website box color here.'
                                                className1="h-11"
                                                label="Box Text Color"
                                                placeholder=""
                                                value={cardColor} onChange={handleColorChange('cardColor', setCardColor)}
                                            />
                                        </div>

                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`modelBackgroundColor`}
                                                tooltip="11"
                                                className="!bg-white flex w-full"
                                                content='You can change website popup background color here.'
                                                className1="h-11 "
                                                label="Popup Background Color"
                                                placeholder=""
                                                value={modelBackgroundColor} onChange={handleColorChange('modelBackgroundColor', setModelBackgroundColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`modelColor`}
                                                tooltip="12"
                                                className="!bg-white flex !w-[163px]"
                                                content='You can change website popup text color here.'
                                                className1="h-11"
                                                label="Popup Text Color"
                                                placeholder=""
                                                value={modelColor} onChange={handleColorChange('modelColor', setModelColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`inActiveButtonBackgroundColor`}
                                                tooltip="13"
                                                className="!bg-white flex w-full"
                                                content='You can change website inactive button background color here.'
                                                className1="h-11 "
                                                label="Inactive Button Color"
                                                placeholder=""
                                                value={inActiveButtonBackgroundColor} onChange={handleColorChange('inActiveButtonBackgroundColor', setInActiveButtonBackgroundColor)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <Input
                                                type="color"
                                                name={`inActiveButtonColor`}
                                                tooltip="14"
                                                className="!bg-white flex w-full"
                                                content='You can change website inactive button text color here.'
                                                className1="h-11"
                                                label="Inactive Button Text Color"
                                                placeholder=""
                                                value={inActiveButtonColor} onChange={handleColorChange('inActiveButtonColor', setInActiveButtonColor)}
                                            />
                                        </div>
                                    </Grid>
                                </div>
                                <div className="col-span-6">
                                    <Grid>
                                        <div className="col-span-8">
                                            <p className="flex text-[14px]  font-semibold justify-between pr-4">
                                                Do you want to show white label logo?
                                            </p>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="flex w-full justify-between">
                                                <RadioButton
                                                    id="yes-isShow"
                                                    label="Yes"
                                                    value="yes"
                                                    checked={isShow === "yes"}
                                                    onChange={handleRadioChange1}
                                                />
                                                <RadioButton
                                                    id="no-isShow"
                                                    label="No"
                                                    value="no"
                                                    checked={isShow === "no"}
                                                    onChange={handleRadioChange1}
                                                />
                                            </div>
                                        </div>
                                    </Grid>
                                </div>
                            </Grid>
                            <div className="text-right">
                                {defaults && <Button onClick={() => setIsSetDefalt(true)} className="mt-3 mr-3 text-sm !font-semibold !border-light-black !border-[1px]" type="button">Set As Default Color</Button>}

                                <InActiveButton onClick={() => handleReset(props.id)} className="mt-3 mr-3 text-sm !font-semibold  !border-[1px]" type="button">Reset</InActiveButton>
                                <Button className="mt-3" type="submit">Submit</Button>
                            </div>
                        </form>

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

            <Modal isOpen={isSetDefalt} onClose={closeDefalt}>
                <div className="text-center py-3">
                    <img src={assign} alt="email Image" className="mx-auto" />
                    <p className="text-3xl mb-0 mt-2 font-semibold ">
                        Would you like to set it as the default color?
                    </p>
                    <Grid className="!grid-cols-4 my-5 ">
                        <div className="col-span-1"></div>
                        <Button
                            onClick={() => {
                                handleDefault(props.id);
                            }}
                        >
                            Yes
                        </Button>
                        <InActiveButton
                            className="border w-full !text-sm !font-Regular"
                            onClick={() => closeDefalt()}
                        >
                            No
                        </InActiveButton>
                        <div className="col-span-1"></div>
                    </Grid>
                </div>
            </Modal>
        </>
    );
}

export default ServicerSetting;
