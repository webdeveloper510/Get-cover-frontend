import React from 'react';
import PropTypes from 'prop-types';

const TableComponent = ({ data, columns, defaultPageSize, availablePageSizes }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to the first page when changing page size
  };

  // Generate an array of page numbers based on the total number of pages
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div>
      {/* Dropdown for selecting the number of items per page */}
     

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-2 px-4 border-b border-gray-300">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={column.key} className="py-2 px-4 border-b border-gray-300">
                  {item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">

      <div className="mb-3">
        <label className="mr-2">Items per page:</label>
        <select value={pageSize} onChange={handlePageSizeChange}>
          {availablePageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

        <div className="flex items-center">

          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2 px-3 py-1 border border-gray-300"
          >
            Previous
          </button>

          {pageNumbers.map((number) => (
            <p
              key={number}
              className={`cursor-pointer px-2 py-1 border border-gray-300 ${number === currentPage ? 'bg-gray-300' : ''}`}
              onClick={() => paginate(number)}
            >
              {number}
            </p>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300"
          >
            Next
          </button>

        </div>
        
      </div>
    </div>
  );
};

TableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  defaultPageSize: PropTypes.number,
  availablePageSizes: PropTypes.arrayOf(PropTypes.number),
};

TableComponent.defaultProps = {
  defaultPageSize: 10,
  availablePageSizes: [10, 20, 50, 100],
};

export default TableComponent;
