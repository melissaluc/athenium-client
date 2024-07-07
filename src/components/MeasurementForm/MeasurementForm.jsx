import Calendar from './Calendar/Calendar';
import MeasurementInput from './MeasurementInput';
import { useState } from 'react';
import { Button, Typography, Container, Box, TextField } from '@mui/material';
import BodyAvatar from '../../assets/Body';

function MeasurementForm({ waistHipRatio, inputValues, handleInputChange, handleSelectDate }) {
    const [selectLabel, setSelectLabel] = useState(false);


    const handleInputClick = (label) => {
        console.log(label);
        setSelectLabel(label);
    };

    return (
        <Container>
            <Calendar handleSelectDate={handleSelectDate} />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem', // Add gap between components
                }}
            >
                <MeasurementInput inputs={inputValues.right} handleInputClick={handleInputClick} handleInputChange={handleInputChange} side='right' />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
          
                    {/* <Box sx={{ marginBottom: '1rem' }}>
                        <TextField
                            id="outlined-read-only-input"
                            label="Waist-to-Hip Ratio"
                            defaultValue={waistHipRatio && waistHipRatio.toFixed(2)}
                            InputProps={{
                                readOnly: true,
                                style: {
                                    fontSize: '0.7rem', // Adjust the font size as needed
                                    textAlign:'center'
                                },
                            }}
                            sx={{
                                width: '3.5rem',
                                paddingTop: '1rem', // Adjusted top padding
                                '& .MuiInputLabel-root': {
                                    whiteSpace: 'normal',
                                    fontSize: '0.8rem', // Adjusted font size
                                },
                            }}
                        />
                    </Box> */}
             

                    <BodyAvatar selectLabel={selectLabel} data={{...inputValues.left,...inputValues.right}} sx={{ width: '150px', height: 'auto' }} /> {/* Adjusted avatar size */}
                </Box>
                <MeasurementInput inputs={inputValues.left} handleInputClick={handleInputClick} handleInputChange={handleInputChange} side='left' />
            </Box>
        </Container>
    );
}

export default MeasurementForm;
