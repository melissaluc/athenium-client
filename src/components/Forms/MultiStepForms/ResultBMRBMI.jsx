import { Typography } from "@mui/material";
import { calculateAge, convertCmToFtIn, convertFtInToCm } from "../../../utils/utils";
import { useEffect } from "react";

function ResultsBMRBMI ({data, handleParentFormChange}) {
    const {current_body_weight, height_cm, uom, dob} = data

    // cm & kg
    const age = calculateAge(dob)
    let weight
    let height

    if(uom.height === 'ft'){
        const {feet, inches} = convertCmToFtIn(height_cm)
        height= {feet, inches}
    } else {
        height = height_cm
    }

    if(uom.body_mass === 'lb') {
        // convert to kg
        weight = current_body_weight * 0.453592
    } else {
        weight = current_body_weight
    }

    const bmi = (weight/Math.pow(height_cm/100, 2)).toFixed(1)
    const bmr_mifflin_eqn = Math.round((10 * weight) + (6.25 * height_cm) - (5 * age) - 161);
    // Underweight: BMI < 18.5
    // Normal weight: 18.5 ≤ BMI < 24.9
    // Overweight: 25 ≤ BMI < 29.9
    // Obesity: BMI ≥ 30

    useEffect(()=>{
        handleParentFormChange({
            bmi,
            bmr:bmr_mifflin_eqn
        });
    },[])

    return (
        <>
            <Typography>{age} years</Typography>
            <Typography>{uom.height==='ft'? `${height.feet}'${height.inches}"`: `${height_cm} ${uom.height}`}</Typography>
            <Typography>{current_body_weight}{uom.body_mass}</Typography>
            <Typography>{bmr_mifflin_eqn} calories/day</Typography>
            <Typography>{bmi}</Typography>
        </>
    )
}

export default ResultsBMRBMI;