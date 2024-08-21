import React, { useState, useEffect } from 'react';
import { MenuItem, Divider, InputBase, Paper, TextField, FormControl, FormLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CustomizedInput({ id, inputValue, placeholderText, options, defaultValue, onChangeSelect, onChange, label, fieldName, inputLabel, addStyle }) {
    const [selectValue, setSelectValue] = useState(defaultValue);
    const [formFieldValue, setFormFieldValue] = useState(inputValue || '')
    const theme = useTheme()

    // Handle selection change
    const handleSelectChange = (e) => {
        const newValue = e.target.value;
        setSelectValue(newValue);        
        onChangeSelect(e, newValue); 
    };


    const handleInputChange = (e)=> {
        const inputFieldName = e.target.name
        const inputValue = e.target.value
        setFormFieldValue(e.target.value)
        onChange(null, inputFieldName, inputValue)
    }

    return (
        <FormControl fullWidth sx={addStyle}>
            {label && 
                <FormLabel
                sx={{
                    color: '#3D3D3D', // Set the default color
                    '&.MuiFormLabel-root': {
                        color: '#3D3D3D', // Set the default color
                    },
                    '&.Mui-focused': {
                        color: '#3D3D3D', // Maintain color on focus
                    },
                }}
            >
                {label.toUpperCase()}</FormLabel>}
            <Paper
                component="form"
                sx={{
                    p: '2px 2px',
                    display: 'flex', 
                    alignItems: 'center',
                    width: '60vw',
                    boxShadow: 'none', // Remove the shadow
                    border: '1px solid', // Add a border
                    borderColor: '#D9D9DE', // Adjust border color (optional)
                    borderRadius: 1 // Optional: Adjust border radius if needed
                }}
            >
                {inputLabel && <FormLabel
                                sx={{
                                    color: '#3D3D3D', // Set the default color
                                    padding:'0% 2%',
                                    '&.MuiFormLabel-root': {
                                        color: '#3D3D3D', // Set the default color
                                    },
                                    '&.Mui-focused': {
                                        color: '#3D3D3D', // Maintain color on focus
                                    },
                                }}
                >{inputLabel.toUpperCase()}</FormLabel>}
                <InputBase
                    onChange={handleInputChange}
                    name={fieldName}
                    value={formFieldValue}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={placeholderText}
                    inputProps={{ 'aria-label': placeholderText || 'Input' }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                <TextField
                    id={id}
                    name={fieldName}
                    select={options? true : false}
                    color={theme.palette.primary.main}
                    value={selectValue}
                    onChange={handleSelectChange}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true, // Remove the underline
                    }}
                    sx={{
                        width:'20%',
                        padding: '1rem',
                        '& .MuiSelect-icon': {
                            display: 'none', // Hide the dropdown arrow
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
            </Paper>
        </FormControl>
    );
}



export default CustomizedInput;
