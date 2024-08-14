import { FormGroup, TextField, Typography, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

function LeanMuscleMass({ data, handleParentFormChange }) {
    const theme = useTheme();
    const { lean_muscle_mass, body_fat_percentage, current_body_weight, uom } = data;

    const [formData, setFormData] = useState({
        lean_muscle_mass: lean_muscle_mass || '',  // Initialize with existing value or empty
        uom: {
            body_mass: uom.body_mass,
            height: uom.height,
        }
    });

    const [userModified, setUserModified] = useState(false); // Track if user has modified the input

    useEffect(() => {
        if (!userModified && formData.lean_muscle_mass === '' && current_body_weight && body_fat_percentage) {
            const bodyFatDecimal = body_fat_percentage / 100;
            const bodyFatMass = current_body_weight * bodyFatDecimal;
            const calculatedLeanMuscleMass = current_body_weight - bodyFatMass;

            setFormData(prevFormData => ({
                ...prevFormData,
                lean_muscle_mass: calculatedLeanMuscleMass.toFixed(2)  // Set to 2 decimal places
            }));

            handleParentFormChange({
                lean_muscle_mass: calculatedLeanMuscleMass.toFixed(2)  // Sync with parent
            });
        }
    }, [body_fat_percentage, current_body_weight, handleParentFormChange, userModified]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = parseFloat(value) || ''; // Ensure value is numeric or empty

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: numericValue
        }));

        handleParentFormChange({
            [name]: numericValue
        });

        setUserModified(true); // Indicate that the user has modified the input
    };

    return (
        <form>
            <FormGroup sx={{display:'flex', flexDirection:'row', gap:'1rem'}}>
                <TextField
                    id="lean_muscle_mass"
                    autoComplete="lean_muscle_mass"
                    name="lean_muscle_mass"
                    placeholder=''
                    value={formData.lean_muscle_mass}
                    variant="outlined"
                    required
                    onChange={handleChange}
                    sx={{
                        width: '4rem',
                        backgroundColor: 'lightblue',
                        borderRadius: 2,
                        '& .MuiInputBase-input': {
                            borderRadius: 2,
                        },
                        '& .MuiInputBase-root': {
                            '&:hover fieldset': {
                                borderColor: `${theme.palette.primary.main}`,
                            },
                        },
                    }}
                />
                <Typography>
                    {uom.body_mass}
                </Typography>
            </FormGroup>
        </form>
    );
}

export default LeanMuscleMass;
