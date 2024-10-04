function findClosestData(selectedDate, data) {
    // Selected Date in unix seconds
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

function calculateAge(birthDate, calculatedOn = null) {
    // Convert birthDate to Date object
    const birthDateObj = new Date(birthDate);

    // If no calculatedOn date is provided, use today
    const today = calculatedOn ? new Date(calculatedOn) : new Date();

    // Calculate age
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();

    // Adjust age if the birthday hasn't occurred yet in the current year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    return age;
}

const convertLbtoKg = (lb) => {
    if(lb === 0){
        return 0
    } else {
        return (lb * 0.453592).toFixed(1);
    }
}

const convertKgtoLb = (kg) => {
    if(kg === 0){
        return 0
    } else {
        return (kg * 2.20462).toFixed(1);
    }
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

const convertCmtoIn = (cm) => {
    return (cm/2.54).toFixed(2);
};

const convertIntoCm = (inches) => {
    return inches*2.54;
};

function unixToLocal(unixTimestamp) {
    // seconds
    console.log('unixTime: ',unixTimestamp)
    const date = new Date(unixTimestamp*1000);


    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} at ${hours}:${minutes}`;
}


function roundToDecimalPlace(number, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}
  


export { 
    findClosestData, 
    getProgressColour, 
    getStrengthRating, 
    calculateAge, 
    convertCmToFtIn, 
    convertFtInToCm,
    unixToLocal,
    convertLbtoKg,
    convertKgtoLb,
    convertCmtoIn,
    convertIntoCm,
    roundToDecimalPlace
};