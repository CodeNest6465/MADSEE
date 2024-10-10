// Function to check if the specific modal is visible and matches the title
async function isPLModalVisible(page: any): Promise<boolean> {
    const headingSelector = 'h4#modal-basic-title'; // Selector for the modal's title
    const headingText = await page.evaluate(headingSelector => {
        const headingElement = document.querySelector(headingSelector);
        return headingElement ? headingElement.textContent?.trim() : null;
    }, headingSelector);
    
    return headingText === 'P&L Economical Valuation Applications Settings';
}

// Main function to capture table data from the P&L modal
async function capturePLTableData(page: any) {
    // Wait for the modal to be visible
    if (await isPLModalVisible(page)) {
        console.log("P&L modal is found.");

        // Wait for the table inside the modal to be visible
        await page.waitForSelector('.modal-body', { visible: true });

        // Select the modal body
        const modalBody = await page.$('.modal-body');

        if (modalBody) {
            // Select the closest table within the modal
            const targetTable = await modalBody.$('.table.table-striped.table-bordered');

            if (targetTable) {
                console.log("P&L Table found");

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

                    return { headers, rows };
                }, targetTable);

                // Log the captured formatted data including headers
                console.log(formattedData);
            } else {
                console.error('P&L Table not found within the modal.');
            }
        } else {
            console.error('Modal body not found.');
        }
    } else {
        console.error('P&L modal is not visible or incorrect modal is opened.');
    }
}

// Example usage: call the function within your Playwright test context
await capturePLTableData(page);
