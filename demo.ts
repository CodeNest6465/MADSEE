// Function to check if the modal with the specific heading is visible
async function isModalVisible(page: any): Promise<boolean> {
    const headingSelector = 'h4#modal-basic-title'; // Selector for the modal's title
    const headingText = await page.evaluate(headingSelector => {
        const headingElement = document.querySelector(headingSelector);
        return headingElement ? headingElement.textContent?.trim() : null;
    }, headingSelector);
    
    return headingText === 'P&L Economical Valuation Applications Settings';
}

// Main function to capture table data
async function captureTableData(page: any) {
    // Check if the modal is visible
    if (await isModalVisible(page)) {
        console.log("Modal with the specific heading is found.");

        // Wait for the table to be visible and ensure it is loaded
        await page.waitForSelector('.table.table-striped.table-bordered', { visible: true }); // Using class selector

        // Select the table by its class
        const targetTable = await page.$('.table.table-striped.table-bordered');

        if (targetTable) {
            console.log("Table found");

            // Capture formatted data from the table
            const formattedData = await page.evaluate((table) => {
                if (!table) return [];

                // Get headers
                const headerElements = Array.from(table.querySelectorAll('thead th'));
                const headers = headerElements.map(header => header.textContent?.trim() || '');

                // Function to get cell values considering input elements
                function getGridCellValue(cell: any): string {
                    let value = '';
                    const fieldElement = cell.querySelector('input, select, textarea, ng-select');

                    if (fieldElement) {
                        if (fieldElement.tagName.toLowerCase() === 'input') {
                            value = (fieldElement as HTMLInputElement).value.trim();
                        } else if (fieldElement.tagName.toLowerCase() === 'select') {
                            value = (fieldElement as HTMLSelectElement).value.trim();
                        } else if (fieldElement.tagName.toLowerCase() === 'textarea') {
                            value = (fieldElement as HTMLTextAreaElement).value.trim();
                        } else if (fieldElement.tagName.toLowerCase() === 'ng-select') {
                            const selectedOption = fieldElement.querySelector('.ng-value .ng-value-label');
                            value = selectedOption?.textContent?.trim() || '';
                        }
                    } else {
                        value = cell.textContent?.trim() || '';
                    }
                    return value;
                }

                // Get rows and their data
                const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    const rowData: Record<string, string> = {};
                    headers.forEach((header, index) => {
                        const cell = cells[index];
                        rowData[header] = getGridCellValue(cell);
                    });
                    return rowData;
                });

                return rows;
            }, targetTable);

            // Log the captured formatted data
            console.log(formattedData);
        } else {
            console.error('Table not found.');
        }
    } else {
        console.error('Modal with the specific heading is not visible.');
    }
}

// Example usage: call the function within your Playwright test context
await captureTableData(page);
