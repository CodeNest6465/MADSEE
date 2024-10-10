const table = await page.$('#plEconomicTable');

// Get all rows from the table
const rows = await table.$$('tbody tr');

let tableData: string[][] = [];

// Iterate over each row
for (const row of rows) {
  // Get all cells (td elements) within the row
  const cells = await row.$$('td');

  // Extract the text content from each cell
  let rowData: string[] = [];
  for (const cell of cells) {
    const cellText = await cell.textContent();
    rowData.push(cellText?.trim() || ''); // Add trimmed text content to row data
  }

  // Add the row's data to the table data
  tableData.push(rowData);
}

console.log(tableData);



// Get the table element by its ID
const table = await page.$('#plEconomicTable');

// Get all rows in the table body
const rows = await table.$$('tbody tr');

let tableData: string[][] = [];

// Iterate over each row
for (const row of rows) {
    // Get all cells within the row
    const cells = await row.$$('td');
    
    // Initialize an array to hold the row data
    let rowData: string[] = [];

    // Extract text from each cell and push to rowData array
    for (const cell of cells) {
        const cellText = await cell.evaluate(el => el.textContent.trim());
        rowData.push(cellText);
    }

    // Add the rowData array to the overall tableData array
    tableData.push(rowData);
}

// Output the table data to verify it's correct
console.log(tableData);

