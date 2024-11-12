import * as path from 'path';
import * as xlsx from 'xlsx';

// Function to update the mnemonic: 
// Moves the value from incoming heading to outgoing heading, deleting the original value and shifting cells up.
async function updateMnemonic(filePath: string, sheetName: string, incomingHeading: string, outgoingHeading: string) {
    // Read the existing Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        console.log(`Sheet ${sheetName} not found`);
        return;
    }

    const headings = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const incomingCol = headings.indexOf(incomingHeading);
    const outgoingCol = headings.indexOf(outgoingHeading);

    if (incomingCol === -1 || outgoingCol === -1) {
        console.log(`One or both headings not found in sheet ${sheetName}`);
        return;
    }

    // Get the first row element after the incoming heading
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const firstRow = rows[1]; // The first row after the heading
    const tempValue = firstRow[incomingCol]; // Store the value in a temp variable

    if (tempValue) {
        // Delete the value in the incoming column and shift the cells upwards
        delete worksheet[xlsx.utils.encode_cell({ r: 1, c: incomingCol })];

        // Shift the remaining cells up
        for (let rowIndex = 1; rowIndex < rows.length - 1; rowIndex++) {
            const currentCellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: incomingCol });
            const nextCellAddress = xlsx.utils.encode_cell({ r: rowIndex + 1, c: incomingCol });

            worksheet[currentCellAddress] = worksheet[nextCellAddress];
            delete worksheet[nextCellAddress];
        }

        // Paste the copied value into the last row of the outgoing column
        const lastRowIndex = rows.length;
        const outgoingCellAddress = xlsx.utils.encode_cell({ r: lastRowIndex, c: outgoingCol });
        worksheet[outgoingCellAddress] = { v: tempValue };

        // Save the updated workbook
        xlsx.writeFile(workbook, filePath);
        console.log(`Mnemonic updated successfully in sheet ${sheetName}`);
    } else {
        console.log(`No value found under ${incomingHeading} in the first row`);
    }
}

// Function to add mnemonic to the first row after heading based on sheetname and headingname
async function addMnemonic(filePath: string, sheetName: string, headingName: string, mnemonic: string) {
    // Read the existing Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        console.log(`Sheet ${sheetName} not found`);
        return;
    }

    const headings = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const headingCol = headings.indexOf(headingName);

    if (headingCol === -1) {
        console.log(`Heading ${headingName} not found in sheet ${sheetName}`);
        return;
    }

    // Insert the mnemonic into the first available row under the heading
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const firstRowIndex = 1; // First row after heading
    const mnemonicCellAddress = xlsx.utils.encode_cell({ r: firstRowIndex, c: headingCol });
    worksheet[mnemonicCellAddress] = { v: mnemonic };

    // Save the updated workbook
    xlsx.writeFile(workbook, filePath);
    console.log(`Mnemonic added successfully under ${headingName} in sheet ${sheetName}`);
}

// Function to get the first row value after heading based on sheetname and headingname
async function getMnemonic(filePath: string, sheetName: string, headingName: string): Promise<string | null> {
    // Read the existing Excel file
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        console.log(`Sheet ${sheetName} not found`);
        return null;
    }

    const headings = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
    const headingCol = headings.indexOf(headingName);

    if (headingCol === -1) {
        console.log(`Heading ${headingName} not found in sheet ${sheetName}`);
        return null;
    }

    // Get the first row value under the heading
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const firstRow = rows[1]; // First row after heading
    const mnemonicValue = firstRow[headingCol];

    return mnemonicValue || null;
}

// Example usage
const filePath = path.resolve(__dirname, '..', 'starware.xlsx'); // Path to your Excel file
await updateMnemonic(filePath, 'GOP', 'Creation', 'Modification');
await addMnemonic(filePath, 'GOP', 'Creation', 'NewMnemonic');
const mnemonic = await getMnemonic(filePath, 'GOP', 'Creation');
console.log('Retrieved mnemonic:', mnemonic);
