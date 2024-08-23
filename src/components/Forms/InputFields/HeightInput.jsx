import React, { useState, useEffect } from 'react';
import { Divider, InputBase, Paper, TextField, Box, FormLabel, FormGroup, Switch} from '@mui/material';
import { convertCmToFtIn, convertFtInToCm } from "../../../utils/utils";
import { useTheme } from '@mui/material/styles';


function HeightInput({ addStyle, id, placeholderText, defaultValue, defaultLabel, onChangeToggle, onChange}) {
    const [heightFt, setHeightFt] = useState({ft:'', in:''})
    const [heightCm, setHeightCm] = useState(defaultValue);
    const [onInit, setOnInit] = useState(true);
    const [toggleUOM, setToggleUOM] = useState(defaultLabel === 'ft');
    const theme = useTheme()
    // useEffect(()=>{
    //     console.log('defaultValue: ',defaultValue,' toggleUOM: ',toggleUOM,' heightFt: ',heightFt)
    // },[])
    const handleSwitchChange = (event) => {
        const newUOM = event.target.checked ? {height: 'ft' } : { height: 'cm' };
        onChangeToggle(newUOM)
        setToggleUOM(event.target.checked);
        setOnInit(false)
    };

    const handleInputChange = (e) => {
        const heightName = e.target.name;
        const value = parseFloat(e.target.value) || 0; // Convert value to a number if possible

        let newHeightFt = { ...heightFt };
        let newHeightCm = heightCm;

        if (heightName === 'height_ft') {
            newHeightFt.ft = value;
            newHeightCm = convertFtInToCm(value, heightFt.in);
        } else if (heightName === 'height_in') {
            newHeightFt.in = value;
            newHeightCm = convertFtInToCm(heightFt.ft, value);
        } else if (heightName === 'height_cm') {
            newHeightCm = value;
            const { feet, inches } = convertCmToFtIn(value);
            newHeightFt = { ft: feet, in: inches };
        }

        // Update state
        setHeightFt(newHeightFt);
        setHeightCm(newHeightCm);

        // Notify parent component of change
        onChange(null, 'height_cm', newHeightCm);
    };
    

    useEffect(() => {
        if(onInit){
            if (toggleUOM) {
                // When toggling to feet/inches, convert cm to feet and inches
                const { feet, inches } = convertCmToFtIn(heightCm);
                setHeightFt({ ft: feet, in: inches });
            }  
        } else {
            if (toggleUOM) {
                // When toggling to feet/inches, convert cm to feet and inches
                const { feet, inches } = convertCmToFtIn(heightCm);
                setHeightFt({ ft: feet, in: inches });
            } 
            else {
                // When toggling to cm, convert feet and inches to cm
                const cm = convertFtInToCm(heightFt.ft, heightFt.in);
                setHeightCm(cm);
            }
        }
    }, [toggleUOM, onInit]);


    return (
        <Box fullWidth sx={addStyle}>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between', alignItems:'baseline', margin: 0, padding:0}}>
                <FormLabel 
                sx={{
                    '&.MuiFormLabel-root': {
                        color: '#3D3D3D',
                        '&.Mui-focused': {
                            color: '#3D3D3D',
                        },
                    },
                }}>HEIGHT IN {toggleUOM ? 'IMPERIAL' : 'METRIC'}</FormLabel>
                <Switch
                    checked={toggleUOM}
                    onChange={handleSwitchChange}
                    inputProps={{ 'aria-label': 'height unit switch' }}
                />
            </FormGroup>
            <Paper
                    component="form"
                    sx={{
                        p: '2px 2px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '60vw',
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: '#D9D9DE',
                        borderRadius: 1
                    }}
                >
            {toggleUOM ? (
                    <>
                        <InputBase
                            name={'height_ft'}
                            placeholder={'feet'}
                            value={heightFt.ft}
                            sx={{ ml: 1, flex: 1 }}
                            onChange={handleInputChange}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <TextField
                            id={`${id}-ft`}
                            name="feet"
                            value='ft'
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                            }}
                            sx={{
                                width:'15%',
                                padding: '1rem',
                                '& .MuiSelect-icon': {
                                    display: 'none',
                                },
                                '& .MuiInputBase-input': {
                                    color: theme.palette.primary.main, 
                                },
                            }}
                        />
                        <InputBase
                            value={heightFt.in}
                            placeholder={'inches'}
                            name={'height_in'}
                            sx={{ ml: 1, flex: 1 }}
                            onChange={handleInputChange}
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <TextField
                            placeholder={'inches'}
                            id={`${id}-in`}
                            name="inches"
                            value='in'
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                            }}
                            sx={{
                                width:'15%',
                                padding: '1rem',
                                '& .MuiSelect-icon': {
                                    display: 'none',
                                },
                                '& .MuiInputBase-input': {
                                    color: theme.palette.primary.main, 
                                },
                            }}
                        />
                    </>
            ) : (
                <>
                    <InputBase
                        name={'height_cm'}
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={'Height'}
                        inputProps={{ 'aria-label': placeholderText || 'Input' }}
                        value={heightCm}
                        onChange={handleInputChange}
                    />
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <TextField
                        id={`${id}-cm`}
                        name="cm"
                        value='cm'
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
                    </TextField>
                </>
                
            )}
            </Paper>
        </Box>
    );
}

export default HeightInput;
