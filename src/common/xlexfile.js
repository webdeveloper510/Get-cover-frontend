import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const xlexfile = (data) => {
    // Filter data to include only claim_id, approved_date, and claim_amount
    const filteredData = data.map(({ unique_key, approveDate, totalAmount }) => {
        // Convert claimDate to MM/DD/YYYY format
        const date = new Date(approveDate);
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

        return {
            'Claim ID': unique_key,
            'Approved Date': formattedDate,
            'Claim Amount($)': totalAmount,
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims');

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Use the first claim_id in data for the filename
    saveAs(blob, `Claims_Report.xlsx`);
};

export default xlexfile;