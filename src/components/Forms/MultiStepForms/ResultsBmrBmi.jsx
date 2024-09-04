import { Typography, Box, Chip, Divider } from "@mui/material";
import { calculateAge, convertCmToFtIn} from "../../../utils/utils";
import { useEffect } from "react";
import BmiRangeChart from "../../Charts/BmiRangeChart";


const getBmiChip = (bmi) => {
    if (bmi < 18.5) {
        return { label: "UNDERWEIGHT", color: "#67aed4" }; 
    } else if (bmi >= 18.5 && bmi < 25) {
        return { label: "NORMAL", color: "#6ed161" }; 
    } else if (bmi >= 25 && bmi < 30) {
        return { label: "OVERWEIGHT", color: "#f3d266" }; 
    } else if (bmi >= 30 && bmi < 35) {
        return { label: "OBESITY CLASS I", color: "#e25050" }; 
    } else if (bmi >= 35 && bmi < 40) {
        return { label: "OBESITY CLASS II", color: "#9c2929" }; 
    } else if (bmi >= 40) {
        return { label: "OBESITY CLASS III", color: "#7a1d1d" }; 
    } else {
        return { label: "UNKNOWN", color: "default" }; 
    }
};




function ResultBmrBmi({ data, handleParentFormChange }) {
    const { current_body_weight, height_cm, uom, dob, gender } = data;

    // cm & kg
    const age = calculateAge(dob);
    let weight;
    let height;

    if (uom.height === 'ft') {
        const { feet, inches } = convertCmToFtIn(height_cm);
        height = { feet, inches };
    } else {
        height = height_cm;
    }

    if (uom.body_mass === 'lb') {
        // convert to kg
        weight = current_body_weight * 0.453592;
    } else {
        weight = current_body_weight;
    }

    const bmi = (weight / Math.pow(height_cm / 100, 2)).toFixed(1);
    const { label, color } = getBmiChip(bmi);
    const bmr = Math.round(
        (10 * weight) +
        (6.25 * height_cm) -
        (5 * age) +
        (gender === 'male' ? 5 : -161)
    );

    useEffect(() => {
        handleParentFormChange(
            {
                bmi,
                bmr
            }
        );
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2vh', justifyContent:'center', alignItems: 'center', width:'100%', height:'100%'}}>
            <Box display="flex" flexDirection="column" gap={2} padding={2} borderRadius={1} boxShadow={1} width='100%' alignItems='center'>
                {/* AGE Row */}
                <Box display="flex" alignItems="center" width='50%'>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    AGE
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginLeft: 'auto', marginRight: 8 }}>
                    {age}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="subtitle1" color="primary" style={{ marginLeft: 8 }}>
                    Years
                    </Typography>
                </Box>
            
                {/* HEIGHT Row */}
                <Box display="flex" alignItems="center" width='50%'>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    HEIGHT
                    </Typography>
                    {uom.height === 'ft' ? (
                        <>
                            <Typography variant="subtitle1" style={{ marginLeft: 'auto', marginRight: 8 }}>
                            {height.feet} 
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="subtitle1" color="primary" style={{ marginLeft: 8 }}>
                                ft
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginRight: 8,  marginLeft: 8 }}>
                            {height.inches}
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="subtitle1" color="primary" style={{ marginLeft: 8 }}>
                                in
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="subtitle1" style={{ marginLeft: 'auto', marginRight: 8 }}>
                            {height_cm}
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="subtitle1" color="primary" style={{ marginLeft: 8 }}>
                            {uom.height}
                            </Typography>
                        </>
                    )

                    }
                </Box>
                {/* BODY MASS Row */}
                <Box display="flex" alignItems="center" width='50%'>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                    WEIGHT
                    </Typography>
                    <Typography variant="subtitle1" style={{ marginLeft: 'auto', marginRight: 8 }}>
                    {current_body_weight}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography variant="subtitle1" color="primary" style={{ marginLeft: 8 }}>
                    {uom.body_mass}
                    </Typography>
                </Box>
            </Box>
            
            <Box display="flex" flexDirection="column" alignItems="center" gap={1} padding={2} borderRadius={1} boxShadow={1} width='100%'>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>WE ESTIMATE YOUR BMR TO BE</Typography>
                <Typography variant="subtitle1" style={{ fontSize:'2rem', fontWeight: 'bold' }}>{bmr}</Typography>
                <Typography style={{ fontSize:'0.8rem',fontWeight: 'bold'}}>CALORIES PER DAY</Typography>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent='center' alignItems="center" gap={2} padding={2} borderRadius={1} boxShadow={1} width='100%'>
                <Box display="flex" alignItems="center" flexWrap={'wrap'}>
                    <Typography  variant="subtitle1" style={{ fontWeight: 'bold', marginRight: '8px', fontSize:'0.8rem'}}>
                        YOUR BMI IS WITHIN THE
                    </Typography>
                    <Chip label={label} size='small' style={{fontFamily:'silkscreen', fontSize:'0.8rem', backgroundColor:color, fontWeight: 'bold', marginRight: '8px' }} />
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize:'0.8rem' }}>
                        RANGE
                    </Typography>
                </Box>
                <BmiRangeChart userValue={bmi} />
            </Box>
        </Box>
    );
}

export default ResultBmrBmi;
