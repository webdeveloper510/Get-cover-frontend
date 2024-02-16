import React, { useState, useEffect } from "react";

const CustomPagination = ({
  totalRecords,
  rowsPerPageOptions,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  useEffect(() => {
    onPageChange(currentPage, rowsPerPage);
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [currentPage, rowsPerPage]);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page when changing rows per page
  };

  return (
    <div className="flex items-center justify-between bg-[#333] rounded-[17px] p-[11px] mx-3 mb-3">
    
      <div>
        <label className="text-white pr-3">Rows per page:</label>
        <select value={rowsPerPage} className=" bg-[#333] text-white" onChange={handleRowsPerPageChange}>
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center text-white">
        <button onClick={handleFirstPage} disabled={currentPage === 1}>
          {<svg xmlns="http://www.w3.org/2000/svg" width="24" fill="#fff" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path><path fill="none" d="M24 24H0V0h24v24z"></path></svg>}
        </button>
        <button onClick={handlePrevPage} className="px-3" disabled={currentPage === 1}>
          {<svg xmlns="http://www.w3.org/2000/svg" width="24" fill="#fff" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>}
        </button>
        <span className="px-3">{`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
          currentPage * rowsPerPage,
          totalRecords
        )} Of ${totalRecords}`}</span>
        <button onClick={handleNextPage}  className="px-3" disabled={currentPage === totalPages}>
          {<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>}
        </button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>
          {<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path><path fill="none" d="M0 0h24v24H0V0z"></path></svg>}
        </button>
      </div>
    </div>
  );
};

export default CustomPagination;
