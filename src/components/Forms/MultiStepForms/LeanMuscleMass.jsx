import { FormGroup,  Typography, Chip, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import CustomInput from '../InputFields/CustomInput';
import { calculateAge } from "../../../utils/utils";
import FfmiRangeChart from "../../Charts/FfmiRangeChart";


const getFfmiChip = (ffmi, gender) => {
  
    const ffmiRanges = gender === 'male'
        ? {
            'Low': { min: 0, max: 18, color: '#9c2929' },
            'Average': { min: 18, max: 22, color: '#e2bb50'  },
            'Above Average': { min: 22, max: 25, color: '#07df00'},
            'High': { min: 25, max: 30, color: '#00edf5' },
            'Very High': { min: 30, max: 35, color: '#1b1386' },
            'Exceptional': { min: 35, max: 50, color: '#a00078'  }
        }
        : {
            'Low': { min: 0, max: 16, color: '#9c2929' },
            'Average': { min: 16, max: 20, color: '#e2bb50'  },
            'Above Average': { min: 20, max: 23, color: '#07df00'},
            'High': { min: 23, max: 28, color: '#00edf5' },
            'Very High': { min: 28, max: 33, color: '#1b1386' },
            'Exceptional': { min: 33, max: 50, color: '#a00078'  }
        };

    for (const [label, range] of Object.entries(ffmiRanges)) {
        if (ffmi >= range.min && ffmi < range.max) {
            return { label, color: range.color };
        }
    }

    // Default case if FFMI does not fit into any range
    return { label: "Unknown", color: "rgba(0, 0, 0, 0.08)" };
};

function LeanMuscleMass({ data, handleParentFormChange }) {
    const { lean_muscle_mass, body_fat_percentage, current_body_weight, height_cm, uom, gender, dob, ffmi} = data;
    const [formData, setFormData] = useState({
        lean_muscle_mass: lean_muscle_mass || '',
        ffmi: ffmi || null
    });
    

    const age = calculateAge(dob);


   const calculateValues = () => {
        if (body_fat_percentage && current_body_weight && height_cm) {
            const bodyFatDecimal = body_fat_percentage / 100;
            const bodyFatMass = current_body_weight * bodyFatDecimal;
            const calculatedLeanMuscleMass = current_body_weight - bodyFatMass;
            const weightInKg = uom.body_mass === 'kg' ? calculatedLeanMuscleMass : calculatedLeanMuscleMass * 0.453592;
            const heightInM = height_cm / 100;
            const calculatedFFMI = weightInKg / (heightInM * heightInM);

            return {
                lean_muscle_mass: parseFloat(calculatedLeanMuscleMass).toFixed(2),
                ffmi: parseFloat(calculatedFFMI).toFixed(2)
            };
        }
        return {};
    };

    const { label, color } = getFfmiChip(formData.ffmi, gender);

    useEffect(() => {
        const updatedValues = calculateValues();
        if (Object.keys(updatedValues).length > 0) {
            setFormData(prevFormData => ({
                ...prevFormData,
                ...updatedValues
            }));
            handleParentFormChange(updatedValues);
        }
    }, [body_fat_percentage, current_body_weight, height_cm, uom.body_mass]);

    const handleChange = (e, fieldName, inputValue) => {
        const { name, value } = e ? e.target : { name: fieldName, value: inputValue };

        const updatedValue = ['ffmi', 'lean_muscle_mass'].includes(name)
            ? parseFloat(value)
            : value;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: updatedValue
        }));

        handleParentFormChange({
            ...formData,
            [name]: updatedValue
        });
    };

    return (
        <Box>
            <Box>
            </Box>
            <form>
                <FormGroup sx={{display:'flex', flexDirection:'column', }}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>ESTIMATED FAT FREE MASS (FFM)</Typography>
                    <Typography variant="subtitle1" style={{}}>If you know your FFM manually input the correct value below.</Typography>
                    <CustomInput 
                            fieldName={'lean_muscle_mass'}
                            options={null}
                            addStyle={{marginBottom:'2vh'}}
                            id={'body-mass'}
                            placeholderText={'Enter your FFM'} 
                            defaultValue={uom.body_mass}
                            inputValue={formData.lean_muscle_mass}
                            onChange={handleChange}
                            />
                </FormGroup>
            </form>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2} padding={2} borderRadius={1} boxShadow={1} width='100%'>
                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginRight: '8px'}}>
                        YOUR FFMI IS WITHIN THE
                    </Typography>
                    <Chip label={label} style={{fontFamily:'silkscreen',  backgroundColor:color, fontWeight: 'bold', marginRight: '8px' }} />
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                        RANGE
                    </Typography>
                </Box>
                <FfmiRangeChart userValue={formData.ffmi} gender={gender} />
            </Box>
        </Box>
    );
}

export default LeanMuscleMass;
