function addMnemonic(workbook: xlsx.WorkBook, sheetName: string, headingName: string, mnemonic: string) {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    // Locate the heading column
    const range = xlsx.utils.decode_range(worksheet['!ref'] as string);
    let headingCol = -1;

    for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = worksheet[xlsx.utils.encode_cell({ r: 0, c })];
        if (cell && cell.v === headingName) {
            headingCol = c;
            break;
        }
    }
    if (headingCol === -1) return;

    // Shift rows down and insert the mnemonic
    for (let row = range.e.r; row >= 1; row--) {
        worksheet[xlsx.utils.encode_cell({ r: row + 1, c: headingCol })] = worksheet[xlsx.utils.encode_cell({ r: row, c: headingCol })];
    }
    worksheet[xlsx.utils.encode_cell({ r: 1, c: headingCol })] = { v: mnemonic, t: "s" };

    // Save the workbook
    xlsx.writeFile(workbook, filePath);
}
