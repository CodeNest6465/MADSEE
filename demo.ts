// Wait for the modal to be visible and ensure the table is loaded
await page.waitForSelector('#plEconomicTable', { visible: true });

// Select the table by its ID
const table = await page.$('#plEconomicTable');

// Get all the rows in the table body
const rows = await table.$$('tbody tr');

// Initialize an array to hold the data
let tableData: string[][] = [];

// Loop through each row and extract the cell values
for (const row of rows) {
    const cells = await row.$$('td');
    
    // Initialize an array for row data
    let rowData: string[] = [];

    // Extract text from each cell in the row
    for (const cell of cells) {
        const cellText = await cell.evaluate(el => el.textContent.trim());
        rowData.push(cellText);
    }

    // Add the extracted row data to the tableData array
    tableData.push(rowData);
}

// Output the table data to verify it
console.log(tableData);
