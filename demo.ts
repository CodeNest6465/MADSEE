// Wait for the modal to be visible
await page.waitForSelector('ngb-modal-window[role="dialog"]', { visible: true });

// Wait for the table to be visible and ensure the table is loaded
await page.waitForSelector('#plEconomicTable', { visible: true });

// Select the table by its ID
const table = await page.$('#plEconomicTable');

if (table) {
    // Get all header cells in the table
    const headerCells = await table.$$('thead th');
    const headers: string[] = [];

    // Extract text from each header cell
    for (const header of headerCells) {
        const headerText = await header.evaluate(el => el.textContent.trim());
        headers.push(headerText);
    }

    // Log the header data for debugging
    console.log(`Header data: ${JSON.stringify(headers)}`);

    // Get all the rows in the table body
    const rows = await table.$$('tbody tr');

    // Log the number of rows found
    console.log(`Found ${rows.length} rows in the table.`);

    // Initialize an array to hold the data
    let tableData: (string | null)[][] = []; // Explicitly declare the type as a 2D array of strings or null

    // Loop through each row and extract the cell values
    for (const row of rows) {
        const cells = await row.$$('td');
        
        // Initialize an array for row data
        let rowData: (string | null)[] = []; // Explicitly declare the type as an array of strings or null

        // Extract text from each cell in the row
        for (const cell of cells) {
            const cellText = await cell.evaluate(el => el.textContent.trim() || "N/A"); // Use "N/A" for empty cells
            rowData.push(cellText);
        }

        // Log the row data for debugging
        console.log(`Row data: ${JSON.stringify(rowData)}`);

        // Add the extracted row data to the tableData array
        tableData.push(rowData);
    }

    // Combine headers and body data
    const completeTableData = [headers, ...tableData]; // Combine headers with body data

    // Output the complete table data to verify it
    console.log('Complete table data:', JSON.stringify(completeTableData, null, 2));
} else {
    console.error('Table not found.');
}
