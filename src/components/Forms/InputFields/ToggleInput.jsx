import React, { useState, useEffect } from 'react';
import { Divider, Paper, FormControl, FormLabel, Switch, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function ToggleInput({ id, inputValue, options, defaultValue, onChange, inputLabel, addStyle }) {
    const [selectValue, setSelectValue] = useState(defaultValue || '');
    const theme = useTheme();

    useEffect(() => {
        setSelectValue(defaultValue || '');
    }, [defaultValue]);

    const handleSwitchChange = () => {
        // Toggle between the two options
        const newValue = selectValue === options[0] ? options[1] : options[0];
        setSelectValue(newValue);

        // Notify parent component about the change
        if (onChange) {
            onChange({ target: { name: id, value: newValue } });
        }
    };

    return (
        <FormControl fullWidth sx={addStyle}>
            <Paper
                component="form"
                sx={{
                    p: '2px 2px',
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: '#D9D9DE',
                    borderRadius: 1
                }}
            >
                <FormLabel
                    sx={{
                        color: '#3D3D3D',
                        padding: '0% 2%',
                        '&.MuiFormLabel-root': {
                            color: '#3D3D3D',
                        },
                        '&.Mui-focused': {
                            color: '#3D3D3D',
                        },
                    }}
                >
                    {inputLabel.toUpperCase()}
                </FormLabel>

                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 

                <Typography
                    style={{
                        padding: '0 1rem',
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {selectValue}
                </Typography>

                <Switch
                    checked={selectValue === options[1]}
                    onChange={handleSwitchChange}
                    inputProps={{ 'aria-label': `${inputLabel} unit switch` }}
                />
            </Paper>
        </FormControl>
    );
}

export default ToggleInput;
