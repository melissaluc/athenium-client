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

function getProgressColour(strengthLevel, theme) {
    let colour = null;
    switch (strengthLevel) {
        case "beginner":
            colour = theme.palette.progress.level1;
            break;
        case "novice":
            colour = theme.palette.progress.level2;
            break;
        case "intermediate":
            colour = theme.palette.progress.level3;
            break;
        case "advanced":
            colour = theme.palette.progress.level4;
            break;
        case "elite":
            colour = theme.palette.progress.level5;
            break;
        default:
            colour = null;
    }
    // console.log({one_rep_max: strengthLevel, colour: colour})
    return colour;
}

function getStrengthRating (strengthLevel) {
    let rating = null
    switch(strengthLevel) {
        case 'beginner':
            rating = '⭐'
            break;
        case 'novice':
            rating = '⭐⭐'
            break;
        case 'intermediate':
            rating = '⭐⭐⭐'
            break;
        case 'advanced':
            rating = '⭐⭐⭐⭐'
            break;
        case 'elite':
            rating = '⭐⭐⭐⭐'
            break;
        default:
            rating = null
            break;
                

    }
    return rating

}

function calculateAge(birthDate) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    
    return age;
}


const convertCmToFtIn = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
};


const convertFtInToCm = (feet, inches) => {
    return (feet * 30.48) + (inches * 2.54);
};

function unixToLocal(unixTimestamp) {
    // seconds
    const date = new Date(unixTimestamp*1000);


    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} at ${hours}:${minutes}`;
}



export { findClosestData, getProgressColour, getStrengthRating, calculateAge, convertCmToFtIn, convertFtInToCm,unixToLocal };