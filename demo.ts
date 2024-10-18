async function testDropdowns(ptfPage: any) {
    // Iterate through each business model
    for (const [businessModel, sppiFlows] of Object.entries(assetLiabilityData.FVT)) {
        console.log("Selecting Business Model:", businessModel);
        await ptfPage.selectDropdown('businessModelDropdown', businessModel);
        await ptfPage.closePopup();

        // Iterate through each SPPI flow under the business model
        for (const [sppiIndicator, conditionalValues] of Object.entries(sppiFlows)) {
            console.log("Selecting SPPI Indicator:", sppiIndicator);
            await ptfPage.selectDropdown('sppiIndicatorDropdown', sppiIndicator);
            await ptfPage.closePopup();

            // Check if conditionalValues is an object
            if (typeof conditionalValues === 'object') {
                // Iterate through the conditional values
                for (const [conditionalValue, options] of Object.entries(conditionalValues)) {
                    console.log("Selecting Conditional Value:", conditionalValue);
                    await ptfPage.selectDropdown('conditionalValueDropdown', conditionalValue);
                    await ptfPage.closePopup();

                    // If options is an object, iterate through to select the final value
                    if (typeof options === 'object') {
                        for (const [optionKey, finalValue] of Object.entries(options)) {
                            if (typeof finalValue === 'string' && finalValue) {
                                console.log("Selecting Final Value:", finalValue);
                                await ptfPage.selectDropdown('finalValueDropdown', finalValue);
                                await ptfPage.closePopup();
                            }
                        }
                    } else if (typeof options === 'string') {
                        console.log("Selecting Final Value Directly:", options);
                        await ptfPage.selectDropdown('finalValueDropdown', options);
                        await ptfPage.closePopup();
                    }
                }
            } else if (typeof conditionalValues === 'string') {
                console.log("Selecting SPPI Indicator Value Directly:", conditionalValues);
                await ptfPage.selectDropdown('conditionalValueDropdown', conditionalValues);
                await ptfPage.closePopup();
            }
        }
    }
}

// Example usage in your test
await testDropdowns(ptfPage);
