function findClosestData(selectedDate, data) {
    let closestData = null;

    // Convert selectedDate to a Date object
    const selectedDateTime = new Date(selectedDate);

    // Sort the data array by created_on in descending order
    const sortedData = [...data].sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());

    // Find the closest (most recent) data point
    for (let i = 0; i < sortedData.length; i++) {
        const item = sortedData[i];
        const itemDateTime = new Date(item.created_on);

        // Check if the item's date is before or equal to selectedDate
        if (itemDateTime <= selectedDateTime) {
            closestData = item;
            break;
        }
    }

    console.log('Closest Data:', closestData);
    return closestData;
}



export { findClosestData };