export default class Helper {
    async checkDisabledFields(page: Page) {
        await page.waitForTimeout(3000);

        // Get all input, textarea, select, and ng-select elements
        const fields = await page.locator('input, textarea, select, ng-select').elementHandles();

        for (const field of fields) {
            const isDisabled = await field.evaluate((el) => {
                const element = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
                return element.disabled;  // Check if the field is disabled
            });

            const fieldName = await field.getAttribute('name') || 
                              await field.getAttribute('id') || 
                              await field.getAttribute('placeholder') || 
                              await field.getAttribute('aria-label');

            // If the field is not disabled, log a message
            if (!isDisabled) {
                console.log(`Field '${fieldName}' is not disabled.`);
            }
        }
    }
}




// Assuming you're using the Helper class and a Playwright page is set up
const helper = new Helper();
await helper.checkDisabledFields(page);
