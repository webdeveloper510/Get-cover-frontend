import { saveAs } from 'file-saver';

const xlexfile = (data) => {
    // Format each object into a single line as required
    const formattedData = data.map(({ address, city, state, zip }) => {
        return `${address}, ${city}, ${state}, ${zip}`;
    });

    // Join all lines into a single text block with newlines
    const textContent = formattedData.join('\n');

    // Create a Blob and download it as a .txt file
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'addresses.txt');
};


export default xlexfile
