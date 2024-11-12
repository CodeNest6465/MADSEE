import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';

// Function to check and prepare the Excel file (create if missing)
async function checkAndPrepareFile(fileName: string) {
    const filePath = path.resolve(__dirname, '..', fileName);

    // If the file doesn't exist, create it with initial sheets and headers
    let workbook;
    if (!fs.existsSync(filePath)) {
        // Create a new workbook
        workbook = xlsx.utils.book_new();
        const sheetNames = ['GOP', 'RC', 'PTF'];
        const headings = ['Creation', 'Modification', 'Inactivation', 'Closure', 'Reactivation'];

        sheetNames.forEach(sheetName => {
            const worksheet = xlsx.utils.aoa_to_sheet([headings]);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        // Save the new workbook
        xlsx.writeFile(workbook, filePath);
    } else {
        // If the file exists, load the workbook
        workbook = xlsx.readFile(filePath);
    }

    return { workbook, filePath };
}

// Function to handle adding, removing, and copying mnemonics
async function updateMnemonic(fileName: string, mnemonic: string, creationSuccess: boolean) {
    const { workbook, filePath } = await checkAndPrepareFile(fileName);

    // Column indexes for the required actions
    const sheetNames = ['GOP', 'RC', 'PTF'];
    const headings = ['Creation', 'Modification', 'Inactivation', 'Closure', 'Reactivation'];
    const creationCol = headings.indexOf('Creation');
    const modificationCol = headings.indexOf('Modification');

    sheetNames.forEach(sheetName => {
        let worksheet = workbook.Sheets[sheetName];

        if (worksheet) {
            const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            const lastRow = rows.length;

            if (sheetName === 'GOP' && creationCol !== -1 && modificationCol !== -1) {
                // Find the last row with data in the Creation column
                const creationCellAddress = xlsx.utils.encode_cell({ r: lastRow, c: creationCol });
                worksheet[creationCellAddress] = { v: mnemonic };

                if (creationSuccess) {
                    // Copy mnemonic to the last row in the Modification column
                    const creationValue = worksheet[creationCellAddress]?.v;
                    if (creationValue) {
                        const modLastRow = lastRow + 1; // Next available row in Modification
                        const modCellAddress = xlsx.utils.encode_cell({ r: modLastRow, c: modificationCol });
                        worksheet[modCellAddress] = { v: creationValue };

                        // Delete the mnemonic from Creation column and shift cells up
                        delete worksheet[creationCellAddress];
                        for (let row = lastRow; row > 1; row--) { // Start shifting from last row up to row 1
                            const aboveCellAddress = xlsx.utils.encode_cell({ r: row - 1, c: creationCol });
                            const currentCellAddress = xlsx.utils.encode_cell({ r: row, c: creationCol });
                            worksheet[currentCellAddress] = worksheet[aboveCellAddress];
                            delete worksheet[aboveCellAddress];
                        }
                    }
                }
            }
        }
    });

    // Save the updated workbook
    xlsx.writeFile(workbook, filePath);
}

// Usage example
await updateMnemonic('starware.xlsx', 'YourMnemonic', true); // Set creationSuccess to true for testing
