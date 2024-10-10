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
