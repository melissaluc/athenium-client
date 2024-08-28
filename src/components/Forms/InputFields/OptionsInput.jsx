import React, { useState, useEffect } from 'react';
import { MenuItem, Divider, InputBase, Paper, TextField, FormControl, FormLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function OptionsInput({ id, inputValue, placeholderText, options, defaultValue, onChangeSelect, onChange, label, fieldName, inputLabel, addStyle, inputBase=true }) {
    const [selectValue, setSelectValue] = useState(defaultValue || ''); // Initialize with defaultValue or empty string
    const [formFieldValue, setFormFieldValue] = useState(inputValue || ''); // Initialize with inputValue or empty string
    const theme = useTheme();

    // Synchronize formFieldValue with inputValue prop changes
    useEffect(() => {
        setFormFieldValue(inputValue || '');
    }, [inputValue]);

    // Synchronize selectValue with defaultValue prop changes
    useEffect(() => {
        setSelectValue(defaultValue || '');
    }, [defaultValue]);

    // Handle selection change
    const handleSelectChange = (e) => {
        const newValue = e.target.value;
        setSelectValue(newValue);
        if (onChangeSelect) {
            onChangeSelect(e, newValue);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        const inputFieldName = e.target.name;
        const inputValue = e.target.value;
        setFormFieldValue(inputValue);
        if (onChange) {
            onChange(e, inputFieldName, inputValue);
        }
    };

    return (
        <FormControl fullWidth sx={addStyle}>
            {label && 
                <FormLabel
                    sx={{
                        color: '#3D3D3D',
                        '&.MuiFormLabel-root': {
                            color: '#3D3D3D',
                        },
                        '&.Mui-focused': {
                            color: '#3D3D3D',
                        },
                    }}
                >
                    {label.toUpperCase()}
                </FormLabel>
            }
            <Paper
                component="form"
                sx={{
                    p: '2px 2px',
                    display: 'flex', 
                    alignItems: 'center',
                    width: '100%',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: '#D9D9DE',
                    borderRadius: 1
                }}
            >
                {inputLabel && 
                    <FormLabel
                        sx={{
                            color: '#3D3D3D',
                            padding:'0% 2%',
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
                }{
                inputBase === true &&
                <InputBase
                    onChange={handleInputChange}
                    name={fieldName}
                    value={formFieldValue}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={placeholderText}
                    inputProps={{ 'aria-label': placeholderText || 'Input' }}
                />}
                {defaultValue && 
                <>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                    <TextField
                        id={id}
                        name={fieldName}
                        select={!!options}
                        color={theme.palette.primary.main}
                        value={selectValue}
                        onChange={handleSelectChange}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                        }}
                        sx={{
                            width:'20%',
                            padding: '1rem',
                            '& .MuiSelect-icon': {
                                display: 'none',
                            },
                            '& .MuiInputBase-input': {
                                color: theme.palette.primary.main, 
                            },
                        }}
                    >
                        {options && options.map((option) => (
                            <MenuItem key={option.value || option} value={option.value || option}>
                                {option.label || option}
                            </MenuItem>
                        ))}
                    </TextField>
                </>

                }
            </Paper>
        </FormControl>
    );
}

export default OptionsInput;
