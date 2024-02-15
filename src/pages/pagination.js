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
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={handleFirstPage} disabled={currentPage === 1}>
          {"<<"}
        </button>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          {"<"}
        </button>
        <span>{`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
          currentPage * rowsPerPage,
          totalRecords
        )} | ${totalRecords}`}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          {">"}
        </button>
        <button onClick={handleLastPage} disabled={currentPage === totalPages}>
          {">>"}
        </button>
      </div>
      <div>
        <label>Rows per page:</label>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CustomPagination;
