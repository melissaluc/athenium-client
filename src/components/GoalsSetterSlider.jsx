import { useState, useEffect } from 'react';
import { Slider, Typography, Button, Box } from '@mui/material';

const GoalBodyMeasurementSlider = ({ bodyPart, value, onChange, currentValue }) => {
    const [marks, setMarks] = useState([]);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(500);
    const [range, setRange] = useState(1)



    useEffect(() => {
    const min = value - range;
    const max = value + range;
    const step = 0.25; 
    let marksArray = [];

    for (let i = min; i <= max; i += step) {
        if (i % 1 === 0 || i % 0.25 === 0) {
        marksArray.push({ value: i, label: `${i.toFixed(2)}` });
        }
    }

    setMarks(marksArray);
    setMinValue(min);
    setMaxValue(max);
    }, [value, range]);

    return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Slider
        value={value}
        onChange={onChange}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        marks={marks}
        min={minValue}
        max={maxValue}
        step={0.25}
        sx={{
            '& .MuiSlider-markLabel': {
            fontSize: '0.5rem', // Change the font size of the labels
            },
        }}
        />
        <Typography sx={{ fontSize: '0.75rem' }}>
        {value && currentValue && `${(value - currentValue).toFixed(2)} inches`}
        </Typography>
        <Box sx={{display:'flex', flexDirection:'column', gap:'1rem', margin:'0.8rem 0 0 0'}}>
            <Button>Save</Button>
            <Button>Cancel</Button>
        </Box>
    </Box>
    );
};

export default GoalBodyMeasurementSlider;
