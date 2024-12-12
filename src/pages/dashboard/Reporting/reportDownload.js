import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import DataTable from "react-data-table-component";
import remove from "../../../assets/images/delete.png";
import unassign from "../../../assets/images/Unassign.png";
import download from "../../../assets/images/download.png";
import Primary from "../../../assets/images/SetPrimary.png";
import { RotateLoader } from "react-spinners";
import Card from "../../../common/card";
import SingleView from "../../../common/singleView";
import { deleteDownloadReport, getdeleteReports } from "../../../services/claimServices";
import Modal from "../../../common/model";
import InActiveButton from "../../../common/inActiveButton";
import Button from "../../../common/button";
const url = process.env.REACT_APP_API_KEY_LOCAL;

function ReportDownload() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteReport, setDeleteReport] = useState();
  const [timer, setTimer] = useState(3);
  const [reportId, setReportId] = useState();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [primaryMessage, setPrimaryMessage] = useState("");
  const [secondaryMessage, setSecondaryMessage] = useState("");
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [markLoader, setMarkLoader] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectedAction(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const CustomNoDataComponent = () => (
    <Card className="text-center my-5">
      <p>No records found.</p>
    </Card>
  );

  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
  };
  const columns = [
    {
      name: "Serial #",
      selector: (row, index) => (1 - 1) * 10 + index + 1,
      sortable: true,
      minWidth: "auto",
      maxWidth: "120px",
    },
    {
      name: (
        <div>
          Report
          Name
        </div>
      ),
      selector: (row) => row.fileName,
      sortable: true,
      // minWidth: "100px",

      style: {
        whiteSpace: "pre-wrap",
        textAlign: "center",
      },
    },
    {
      name: (
        <div>
          Report Created On
        </div>
      ),
      selector: (row) => {
        const date = new Date(row.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${formattedDate}    ${formattedTime}`;
      },
      sortable: true,
      // minWidth: "130px",
    },
    {
      name: "Remarks",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <p className="self-center"> {row.status} </p>
      ),
    },
    {
      name: "Last Download",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <p className="self-center"> {row.status} </p>
      ),
    },
    {
      name: "Action",
      minWidth: "auto",
      maxWidth: "80px",
      cell: (row, index) => {
        return (
          <div className="relative">
            <div
              onClick={() =>
                setSelectedAction(selectedAction === index ? null : index)
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
                className={`absolute z-[2] w-[120px] drop-shadow-5xl -right-3 mt-2 py-1 border rounded-lg shadow-md`}
              >
                <div
                  className="text-left py-1 px-2 flex cursor-pointer border-b"
                // onClick={() => openArchive(row._id)}
                >
                  <div
                    style={{
                      maskImage: `url(${download})`,
                      WebkitMaskImage: `url(${download})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="self-center singleViews mr-2 h-4 w-4 "
                  /> Download
                </div>
                <div
                  className="text-left py-1 px-2 flex cursor-pointer"
                  onClick={() => openArchive(row._id)}
                >
                  <div
                    style={{
                      maskImage: `url(${remove})`,
                      WebkitMaskImage: `url(${remove})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                    className="self-center singleViews mr-2 h-4 w-4 "
                  /> Delete
                </div>
              </SingleView>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getReportListData();
    window.scrollTo(0, 0);
  }, []);

  const getReportListData = async (data) => {
    try {
      setLoading(true);
      const res = await getdeleteReports(data);
      setDeleteReport(res.result);
    } catch (error) {
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReports = async (id) => {
    try {
      setMarkLoader(true);
      const res = await deleteDownloadReport(id);
      if (res.status === 200) {
        setIsArchiveOpen(false);
        setPrimaryMessage("Delete Report Successfully");
        setSecondaryMessage("You have successfully delete the report");
        setTimer(3);
        setIsModalOpen1(true);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setMarkLoader(false);
    }
  }

  useEffect(() => {
    let intervalId;
    if (isModalOpen1 && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    if (timer === 0) {
      closeArchive();
      getReportListData();
      closeModal1();
    }
    return () => clearInterval(intervalId);
  }, [isModalOpen1, timer]);

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };

  const openArchive = (id) => {
    setReportId(id);
    setIsArchiveOpen(true);
  };
  const closeArchive = () => {
    setIsArchiveOpen(false);
  };

  return (
    <>
      <div className="mb-8 ml-3">
        <Headbar />
        <div className="flex mt-2">
          <div className="pl-3">
            <p className="font-bold text-[36px] leading-9	mb-[3px]">
              Report List
            </p>
            <ul className="flex self-center">
              <li className="text-sm font-Regular">
                <Link to={"/"}>Home </Link> /{" "}
              </li>
              <li className="text-sm font-semibold ml-1 pt-[1px]">
                {" "}
                Report List{" "}
              </li>
            </ul>
          </div>
        </div>

        <Card className="mt-5  border-[1px] border-Light-Grey rounded-xl">
          <Grid className="!px-[26px] !pb-0">
            <div className="col-span-3 self-center">
              <p className="text-xl font-semibold py-4">Report List</p>
            </div>
            <div className="col-span-9">
            </div>
          </Grid>
          <div className="mb-5 relative">
            {loading ? (
              <div className=" h-[400px] w-full flex py-5">
                <div className="self-center mx-auto">
                  <RotateLoader color="#333" />
                </div>
              </div>
            ) : (
              <DataTable
                draggableColumns={false}
                columns={columns}
                data={deleteReport}
                highlightOnHover
                sortIcon={
                  <>
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
                    {/* <img src={shorting} className="ml-2" alt="shorting" /> */}
                  </>
                }
                pagination
                paginationPerPage={10}
                paginationComponentOptions={paginationOptions}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                noDataComponent={<CustomNoDataComponent />}
              />
            )}
          </div>

        </Card>
      </div>

      <Modal isOpen={isModalOpen1} onClose={closeModal1}>
        <div className="text-center py-3">
          <img src={Primary} alt="email Image" className="mx-auto my-4" />
          <p className="text-3xl mb-0 mt-2 font-[800]">
            {primaryMessage}
          </p>
          <p className="text-base font-medium mt-2">
            {secondaryMessage}
          </p>
          <p className="text-base font-medium mt-2">
            Redirecting you on Report List Page {timer} seconds.
          </p>
        </div>
      </Modal>

      <Modal isOpen={isArchiveOpen} onClose={closeArchive}>
        {markLoader ? (
          <>
            <div className=" h-[400px] w-full flex py-5">
              <div className="self-center mx-auto">
                <RotateLoader color="#333" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center py-3">
              <img src={unassign} alt="email Image" className="mx-auto my-4" />
              <p className="text-3xl mb-0 mt-2 font-[800] px-10">
                Would you like to delete it?
              </p>
              <Grid className="!grid-cols-4 my-5 ">
                <div className="col-span-1"></div>
                <Button onClick={() => deleteReports(reportId)}>Yes</Button>
                <InActiveButton
                  className="border w-full !text-sm !font-Regular"
                  onClick={() => closeArchive()}
                >
                  No
                </InActiveButton>
                <div className="col-span-1"></div>
              </Grid>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default ReportDownload;
