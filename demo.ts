const fs = require('fs');
const path = require('path');

lodificationData = async () => {
    await page.getByRole('button', { name: 'Search' }).click();
    let resp = await repage.elementSearch(page, sharedMnemonic);

    if (resp.status() === 200) {
        console.log("Modification complete.");

        // Define the file path and ensure directories exist
        const filePath = path.join(__dirname, '../../../Starware/rcsharedMnemonic.txt');
        const dir = path.dirname(filePath);

        // Create directory and file if they don't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
        }

        // Append mnemonic at the end of the file
        fs.appendFileSync(filePath, `${sharedMnemonic}\n`);

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        expect(fileContent.includes(sharedMnemonic)).toBeTruthy();
        console.log(`Shared mnemonic "${sharedMnemonic}" saved to ${filePath}`);
        
        validationComplete = true;
    } else if (resp.status() === 204) {
        console.log("No content (204). Retrying...");
    }
}
