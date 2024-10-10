// Wait for the modal to be visible
await page.waitForSelector('ngb-modal-window[role="dialog"]', { visible: true });

// Wait for the table to be visible and ensure the table is loaded
await page.waitForSelector('#plEconomicTable', { visible: true });

// Select the table by its ID
const table = await page.$('#plEconomicTable');

if (table) {
    // Get all the rows in the table body
    const rows = await table.$$('tbody tr');
    
    // Log the number of rows found
    console.log(`Found ${rows.length} rows in the table.`);

    // Initialize an array to hold the data
    let tableData = [];

    // Loop through each row and extract the cell values
    for (const row of rows) {
        const cells = await row.$$('td');
        
        // Initialize an array for row data
        let rowData = [];

        // Extract text from each cell in the row
        for (const cell of cells) {
            const cellText = await cell.evaluate(el => el.textContent.trim());
            rowData.push(cellText);
        }

        // Log the row data for debugging
        console.log(`Row data: ${JSON.stringify(rowData)}`);

        // Add the extracted row data to the tableData array
        tableData.push(rowData);
    }

    // Output the table data to verify it
    console.log('Table data:', JSON.stringify(tableData, null, 2));
} else {
    console.error('Table not found.');
}
