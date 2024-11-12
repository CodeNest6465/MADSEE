import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';

async function updateExcelFile(fileName: string, mnemonic: string, creationSuccess: boolean) {
    // Set the file path to be in the root directory, outside of the 'Star Wars-testing' folder
    const filePath = path.resolve(__dirname, '..', fileName);

    // Check if the file exists; if not, create it
    if (!fs.existsSync(filePath)) {
        const newWorkbook = xlsx.utils.book_new();
        xlsx.writeFile(newWorkbook, filePath);
    }

    // Load the workbook
    const workbook = xlsx.readFile(filePath);
    const sheetNames = ['GOP', 'RC', 'PTF'];
    const headings = ['Creation', 'Modification', 'Inactivation', 'Closure', 'Reactivation'];

    sheetNames.forEach(sheetName => {
        let worksheet = workbook.Sheets[sheetName];

        // Add sheet if it doesn’t exist and insert headings
        if (!worksheet) {
            worksheet = xlsx.utils.aoa_to_sheet([headings]);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        } else {
            // Add headings if missing
            const existingHeadings = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0] || [];
            headings.forEach((heading, index) => {
                if (existingHeadings[index] !== heading) {
                    worksheet[xlsx.utils.encode_cell({ r: 0, c: index })] = { v: heading };
                }
            });
        }

        const creationCol = headings.indexOf('Creation');
        const modificationCol = headings.indexOf('Modification');

        if (sheetName === 'GOP' && creationCol !== -1 && modificationCol !== -1) {
            // Find the last row with data in the Creation column
            const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            const lastRow = rows.length;
            const creationCellAddress = xlsx.utils.encode_cell({ r: lastRow, c: creationCol });
            worksheet[creationCellAddress] = { v: mnemonic };

            if (creationSuccess) {
                // Copy mnemonic to the last row in Modification column
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
    });

    // Save the updated workbook
    xlsx.writeFile(workbook, filePath);
}

// Usage in your test case
await updateExcelFile('starware.xlsx', 'YourMnemonic', true);
