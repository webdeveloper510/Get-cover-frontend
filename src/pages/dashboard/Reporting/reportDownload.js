import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import ActiveIcon from "../../../assets/images/icons/iconAction.svg";
import Headbar from "../../../common/headBar";
import shorting from "../../../assets/images/icons/shorting.svg";
import Grid from "../../../common/grid";
import DataTable from "react-data-table-component";
import { RotateLoader } from "react-spinners";
import Card from "../../../common/card";
import SingleView from "../../../common/singleView";
const url = process.env.REACT_APP_API_KEY_LOCAL;

function ReportDownload() {
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);
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
      maxWidth: "90px",
    },
    {
      name: (
        <div>
          Report
          <br />
          Name
        </div>
      ),
      selector: (row) => row.dealer[0]?.name,
      sortable: true,
      minWidth: "100px",

      style: {
        whiteSpace: "pre-wrap",
        textAlign: "center",
      },
    },
    {
      name: (
        <div>
          Date And
          <br />
          Time
        </div>
      ),
      selector: (row) => row.priceBooks[0]?.name,
      sortable: true,
      minWidth: "130px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex border py-2 rounded-lg w-[80%] mx-auto">
          <div
            className={` ${row.status === "Pending" ? "bg-[#8B33D1]" : "bg-[#6BD133]"
              }  h-3 w-3 rounded-full self-center  mr-2 ml-[8px]`}
          ></div>
          <p className="self-center"> {row.status} </p>
        </div>
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
                className={`absolute z-[2] w-[80px] drop-shadow-5xl -right-3 mt-2 py-1 border rounded-lg shadow-md`}
              >

              </SingleView>
            )}
          </div>
        );
      },
    },
  ];

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
                data={''}
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
    </>
  );
}

export default ReportDownload;
