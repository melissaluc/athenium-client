import Calendar from './Calendar/Calendar';
import MeasurementInput from './MeasurementInput';
import { useState, useContext } from 'react';
import { Button, Typography, Container, Box, TextField, Stack } from '@mui/material';
import BodyAvatar from '../../assets/Body';
import { UserDataContext } from '../../Contexts/UserDataContext';

function MeasurementForm({ waistHipRatio, inputValues, handleInputChange, handleSelectDate }) {
    const [selectLabel, setSelectLabel] = useState(false);
    const {userData} = useContext(UserDataContext)

    const handleInputClick = (label) => {
        console.log(label);
        setSelectLabel(label);
    };

    return (
        <Stack direction='column' alignItems='center' width='100%' spacing={'1rem'}>
            {userData.weight &&
            <Calendar handleSelectDate={handleSelectDate} />}
            <BodyAvatar selectLabel={selectLabel} data={{...inputValues.left,...inputValues.right}} sx={{ width: '150px', height: 'auto' }} /> {/* Adjusted avatar size */}
            <Typography color='primary'>{userData.uom && `In ${userData.uom.girth_measurements.uom ==='cm'? 'cm': 'inches'}`}</Typography>
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

                </Box>
                <MeasurementInput inputs={inputValues.left} handleInputClick={handleInputClick} handleInputChange={handleInputChange} side='left' />
            </Box>
        </Stack>
    );
}

export default MeasurementForm;
