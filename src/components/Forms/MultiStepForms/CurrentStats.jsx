
import { Box, TextField, Typography,  FormControlLabel, useTheme, Autocomplete, FormGroup } from '@mui/material';
import { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import {convertCmToFtIn, convertFtInToCm} from "../../../utils/utils";

function CurrentStats ({data, handleParentFormChange}) {
    const theme = useTheme()
    const [heightFt, setHeightFt] = useState({ft:'', in:''})
    const [toggleUOM, setToggleUOM] = useState(data.uom.height === 'ft');
    const {current_body_weight, height_cm, uom} = data
    const [formData, setFormData] = useState({
        current_body_weight:current_body_weight || '', 
        height_cm: height_cm || '',
        uom: uom || {
            body_mass:'lb',
            height:'cm',
        }
    })

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        handleParentFormChange({ ...formData, [name]: value });
    };



    const handleMassUOMChange = (event, value) => {
        setFormData({
            ...formData,
            uom: {
                ...formData.uom,
                body_mass:value
            }
        });
        handleParentFormChange({
            ...formData,
            uom: {
                ...formData.uom,
                body_mass: value
            }
        });
    };

    const handleSwitchChange = (event) => {
        const newUOM = event.target.checked ? {height: 'ft' } : { height: 'cm' };
        setFormData({
            ...formData,
            uom: {
                ...formData.uom,
                ...newUOM
            },
        });
        handleParentFormChange({
            ...formData,
            uom: {
                ...formData.uom,
                ...newUOM
            },
        });
        setToggleUOM(event.target.checked);
    };
    

    useEffect(() => {
        if (formData.height_cm !== '' & toggleUOM) {
            try{
                const { feet, inches } = convertCmToFtIn(formData.height_cm)
                setHeightFt({
                 ...heightFt,
                 ft:feet, 
                 in:inches
             })

            } catch (error) {
                console.error(error)
            }
        }
        if(heightFt.ft!== '' | heightFt.in!== '' & !toggleUOM ){
            const cm = convertFtInToCm(heightFt.ft,heightFt.in)
            setFormData({
                ...formData,
                height_cm: Math.round(cm)
            })
        }   
    }, [toggleUOM]);


    return (
        <form>
            <Box sx={{display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center', justifyContent:'center'}}>
                <FormGroup sx={{display:'flex', flexDirection:'row', gap:'1rem'}}>
                    <TextField
                                id="current_body_weight"
                                autoComplete="current_body_weight"
                                name="current_body_weight"
                                placeholder='Body Weight'
                                value={formData.current_body_weight}
                                variant="outlined"
                                required
                                onChange={handleChange}
                                sx={{
                                    width: '6rem',
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
                    
                    <Autocomplete
                        disablePortal
                        id="body-mass-uom"
                        options={['lb','kg']}
                        value={formData.uom.body_mass}
                        onChange={handleMassUOMChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                id="body-mass-uom"
                                name="body-mass-uom"
                                placeholder='UOM'
                                value={formData.uom.body_mass}
                                variant="outlined"
                                required
                                sx={{
                                    width: '40%',
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
                        )}
                    />

                </FormGroup>

                <FormGroup sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>        
                    <FormControlLabel
                        value="top"
                        control={
                            <Switch
                            checked={toggleUOM}
                            onChange={handleSwitchChange}
                            inputProps={{ 'aria-label': 'height unit switch' }}
                            />
                        }
                        label={formData.uom.height === 'cm' ? 'metric' : 'imperial'}
                        labelPlacement="top"
                        />           
                </FormGroup>
                <FormGroup sx={{display:'flex', flexDirection:'row', gap:'0.8rem',alignItems:'center', justifyContent:'center'}}>
                    { formData.uom.height ==='cm' ? 
                        <TextField
                                    id="height"
                                    autoComplete="height"
                                    name="height_cm"
                                    placeholder='Height'
                                    value={formData.height_cm}
                                    variant="outlined"
                                    required
                                    onChange={handleChange}
                                    sx={{
                                        width: '6rem',
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

                    :
                        <>
                            <TextField
                                        id="ft"
                                        autoComplete="ft"
                                        name="ft"
                                        value={heightFt.ft}
                                        variant="outlined"
                                        required
                                        onChange={handleChange}
                                        sx={{
                                            width: '15%',
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
                            <Typography>ft</Typography>
                            <TextField
                                        id="in"
                                        autoComplete="in"
                                        name="in"
                                        value={heightFt.in}
                                        variant="outlined"
                                        required
                                        onChange={handleChange}
                                        sx={{
                                            width: '15%',
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

                            <Typography>in</Typography>
                        </>
                    }
                </FormGroup>
        
          
            </Box>
        </form>
    )
}

export default CurrentStats;