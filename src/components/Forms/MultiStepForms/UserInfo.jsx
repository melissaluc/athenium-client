import { Box, Button, TextField, InputAdornment, Typography, Stepper, StepButton,MobileStepper, Step, StepLabel, FormControl, InputLabel, Select, MenuItem, useTheme, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LanguageIcon from '@mui/icons-material/Language';
import TodayIcon from '@mui/icons-material/Today';
import axios from 'axios'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function UserInfo ({data, handleParentFormChange}) {

    const theme = useTheme()
    const [visibility, setVisibility] = useState(false)
    const [countries, setCountries] = useState([])
    const {username, password, confirm_password, google_id, email_address, dob, first_name, last_name, country} = data
    
    const [formData, setFormData] = useState({
        username:username || null, 
        password: password || null,
        confirm_password: confirm_password || null, 
        email_address: email_address || '', 
        dob: dob || '', 
        first_name: first_name || '', 
        last_name: last_name || '', 
        country: country || ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        handleParentFormChange(formData)
    };

    const handleCountryChange = (e, value) => {
        setFormData({
            ...formData,
            country: value || ''
        });
        handleParentFormChange({country: value || ''})
    };
    const toggleVisibility = () => {
        setVisibility(prev => !prev)
    }

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dob: date ? date.toISOString().split('T')[0] : ''
        });
        handleParentFormChange({
            ...formData,
            dob: date ? date.toISOString().split('T')[0] : ''
        });
    };

    useEffect(()=>{

          
        axios.get('https://restcountries.com/v3.1/independent?status=true&fields=name')
        .then(response=>{
            const countriesList = []
            Object.entries(response.data).forEach(([key,group])=>{
                Object.entries(group).forEach(([key,country])=>{
                    countriesList.push(country["common"])
                })
            })
            setCountries(countriesList)

        })
        .catch((error) => {
              console.error(error);
          }
        )
    },[])

    
    useEffect(()=>{
        console.log('userInfo data ',formData)
    },[formData])


    return (
        <form>
            <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>

                {!formData.google_id && <TextField
                            id="username"
                            autoComplete="username"
                            name="username"
                            placeholder='Username'
                            value={formData.username}
                            variant="outlined"
                            required
                            onChange={handleChange}
                            sx={{
                                width: '100%',  
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
                        />}
                {!formData.google_id && <TextField
                            id="password"
                            autoComplete="new-password"
                            name="password"
                            placeholder='Password'
                            value={formData.password}
                            variant="outlined"
                            required
                            type={!visibility ? 'password': 'text'}
                            onChange={handleChange}
                            sx={{
                                width: '100%',
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={toggleVisibility}>
                                        {!visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </InputAdornment>
                                ),
                            }}
                        />}
                {!formData.google_id && <TextField
                            id="confirm_password"
                            autoComplete="new-password"
                            name="confirm_password"
                            placeholder='Confirm Password'
                            value={formData.confirm_password}
                            variant="outlined"
                            required
                            type={!visibility ? 'password': 'text'}
                            onChange={handleChange}
                            sx={{
                                width: '100%',
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
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" onClick={toggleVisibility}>
                                        {!visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </InputAdornment>
                                ),
                            }}
                        />}
                <TextField
                            id="email_address"
                            name="email_address"
                            placeholder='Email Address'
                            value={formData.email_address}
                            variant="outlined"
                            required
                            onChange={handleChange}
                            sx={{
                                width: '100%', 
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
                <TextField
                            id="first_name"
                            name="first_name"
                            placeholder='Name'
                            value={formData.first_name}
                            variant="outlined"
                            required
                            onChange={handleChange}
                            sx={{
                                width: '100%', 
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
                <TextField
                            id="last_name"
                            name="last_name"
                            placeholder='Surname'
                            value={formData.last_name}
                            variant="outlined"
                            required
                            onChange={handleChange}
                            sx={{
                                width: '100%',
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
                <DatePicker
                    selected={formData.dob ? new Date(formData.dob) : null}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    placeholderText='Date of Birth YYYY/MM/DD'
                    customInput={
                        <TextField
                            id="dob"
                            name="dob"
                            variant="outlined"
                            required
                            sx={{
                                width: '100%',
                                
                                borderRadius: 2,
                                '& .MuiInputBase-input': {
                                    borderRadius: 2,
                                },
                                '& .MuiInputBase-root': {
                                    '&:hover fieldset': {
                                        borderColor: theme => theme.palette.primary.main,
                                    },
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <TodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    }
                />
                 <Autocomplete
                    disablePortal
                    id="country-autocomplete"
                    options={countries}
                    value={formData.country}
                    popupIcon={<LanguageIcon />}
                    onChange={handleCountryChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id="country"
                            name="country"
                            placeholder='Country'
                            value={formData.country}
                            variant="outlined"
                            required
                            sx={{
                                width: '100%',
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
                
            </Box>
        </form>
    )
}

export default UserInfo;