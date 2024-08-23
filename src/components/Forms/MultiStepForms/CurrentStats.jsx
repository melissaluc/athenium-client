
import { Box,TextField, FormLabel, useTheme, Autocomplete, FormGroup } from '@mui/material';
import { useState, useEffect} from 'react';
import CustomInput from '../InputFields/CustomInput'
import HeightInput from '../InputFields/HeightInput'



function  CurrentStats ({data, handleParentFormChange}) {
    const theme = useTheme()
    const {current_body_weight, gender,height_cm, uom} = data
    const [formData, setFormData] = useState({
        current_body_weight:current_body_weight || '', 
        height_cm: height_cm || '',
        gender:gender || '',
        uom: uom || {
            body_mass:'kg',
            height:'cm',
        }
    })

    const handleChange = (e, fieldName, inputValue) => {
        const { name, value } = e ? e.target : {name: fieldName, value: inputValue}

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: fieldName==='current_body_weight'?  parseFloat(value) : value
        }));
        handleParentFormChange({ ...formData, [name]: fieldName==='current_body_weight'?  parseFloat(value) : value });
    };

    const handleHeightUOMChange = (newUOM) => {
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
    }



    const handleMassUOMChange = (e, value) => {
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

 
    const handleGenderChange = (e, value) => {
        setFormData({
            ...formData,
            gender: value || ''
        });
        handleParentFormChange({gender: value || ''})
    };



    return (
        <Box sx={{width:'60vw', display:'flex', flexDirection:'column', alignItems:'center'}}>

            <form>
                <FormGroup sx={{margin:'2vh 0'}}>
                    <FormLabel        
                    sx={{
                        color: '#3D3D3D', // Set the default color
                        '&.MuiFormLabel-root': {
                            color: '#3D3D3D', // Set the default color
                        },
                        '&.Mui-focused': {
                            color: '#3D3D3D', // Maintain color on focus
                        },
                    }}>GENDER</FormLabel>
                    <Autocomplete
                            disablePortal
                            id="gender-autocomplete"
                            options={['Male','Female']}
                            value={formData.gender}
                            onChange={handleGenderChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    id="gender"
                                    name="gender"
                                    placeholder='Gender'
                                    value={formData.gender}
                                    variant="outlined"
                                    required
                                    sx={{
                                        p:'4px',
                                        width: '60vw',
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
                <CustomInput 
                    fieldName={'current_body_weight'}
                    addStyle={{marginBottom:'2vh'}}
                    id={'body-mass'}
                    label={'Current Body Weight'} 
                    placeholderText={'Body Weight'} 
                    options={['kg','lb']} 
                    defaultValue={formData.uom.body_mass}
                    inputValue={formData.current_body_weight}
                    onChangeSelect={handleMassUOMChange}
                    onChange={handleChange}
                    />
                <HeightInput 
                    addStyle={{marginBottom:'2vh'}}
                    id={'height'}
                    placeholderText={''} 
                    options={[
                        {
                            label:'cm',
                            value:'metric'
                        },
                        {
                            label:['ft','in'],
                            value:'imperial'
                        }
                        ]} 
                    defaultValue={formData.height_cm} 
                    defaultLabel={data.uom.height} 
                    onChange={handleChange}
                    onChangeToggle={handleHeightUOMChange}
                    />
            </form>
        </Box>
    )
}

export default CurrentStats;