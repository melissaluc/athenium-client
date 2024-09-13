import { Typography, Button, Box, Container, Divider, Grid, FormControl, Autocomplete,IconButton,  TextField, Paper, FormLabel } from "@mui/material";
import React, { useState, useContext, useEffect } from 'react';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers/';
import { format, parse, startOfToday } from 'date-fns';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { UserDataContext } from '../Contexts/UserDataContext';
import axios from 'axios';
import SectionDivider from "../components/SectionDivider";
import HeightInput from "../components/Forms/InputFields/HeightInput";
import ToggleInput from "../components/Forms/InputFields/ToggleInput";
import {isEqual} from 'lodash'

function SettingsPage() {
  const { userData, updateUserSettings } = useContext(UserDataContext);
  const dob = userData.dob 
    ? parse(userData.dob, 'yyyy-MM-dd', new Date()) 
    : startOfToday();
  const [initialFormData, setInitialFormData] = useState({
    country: userData.country || '',
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    dob,
    height:userData.height_cm || '',
    uom:{
      lift_weight:userData.uom?.lift_weight?.uom || 'kg',
      body_mass:userData.uom?.body_mass?.uom || 'kg',
      length:userData.uom?.girth_measurements?.uom || 'cm',
      height:userData.uom?.height?.uom || 'cm',
    }
    
  });

  const [formData, setFormData] = useState(initialFormData);
  const [countries, setCountries] = useState([]);
  const theme = useTheme();
  
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const formatDate = (date) => date ? date.toISOString() : '';

  const hasFormChanged = (newFormData, originalFormData) => {
    return newFormData.first_name !== originalFormData.first_name ||
      newFormData.last_name !== originalFormData.last_name ||
      formatDate(newFormData.dob) !== formatDate(originalFormData.dob) ||
      newFormData.country !== originalFormData.country ||
      !isEqual(newFormData.uom, originalFormData.uom);
  };

  useEffect(() => {
    const changesDetected = hasFormChanged(formData, initialFormData);
    setIsFormChanged(changesDetected);
    console.log('formData:', formData);
    console.log('initialFormData:', initialFormData);
    console.log('Changes detected:', changesDetected);
  }, [formData, initialFormData]);

  useEffect(() => {
    // Set initialFormData and formData only when userData changes
    const newInitialFormData = {
      country: userData.country || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      dob: userData.dob ? parse(userData.dob, 'yyyy-MM-dd', new Date()) : startOfToday(),
      uom: {
        lift_weight: userData.uom?.lift_weight.uom || 'lb',
        body_mass: userData.uom?.body_mass.uom || 'lb',
        length: userData.uom?.girth_measurements?.uom || 'cm',
        height: userData.uom?.height?.uom || 'cm',
      },
    };
    setInitialFormData(newInitialFormData);
    setFormData(newInitialFormData);
  }, [userData]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/independent?status=true&fields=name')
      .then(response => {
        const countriesList = [];
        Object.entries(response.data).forEach(([key, group]) => {
          Object.entries(group).forEach(([key, country]) => {
            countriesList.push(country["common"]);
          });
        });
        setCountries(countriesList);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleHeightUOMChange = (newUOM) => {
    setFormData({
        ...formData,
        uom: {
            ...formData.uom,
            ...newUOM
        },
    });
}

  const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
      marginTop: theme.spacing(2),
    },
  }));

  const handleChange = (e, fieldName, inputValue) => {
    const { name, value } = e ? e.target : {name: fieldName, value: inputValue}

    setFormData(prevFormData => ({
        ...prevFormData,
        [name]:  value
    }));

};

const handleUOMChange = (e) => {
  const { name, value } = e.target;

  setFormData(prevFormData => ({
      ...prevFormData,
      uom: {
          ...prevFormData.uom,
          [name]: value
      }
  }));
};

const handleDateChange = (newValue) => {
  setFormData(prevFormData => ({
    ...prevFormData,
    dob: newValue
  }));
};

const handleCancel = () => {
  setFormData(initialFormData);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Saving user settings...')
  try {
    setIsSaving(true)
    await updateUserSettings(formData)
    setIsSaving(false)
    console.log('Settings updated successfully');
  } catch (error) {
    console.error('Error updating settings:', error);
    setIsSaving(false)
  }
}

  // const personalInfoFields = [
  //   { label: 'First Name', key: 'first_name', type: 'text', value: formData.first_name },
  //   { label: 'Last Name', key: 'last_name', type: 'text', value: formData.last_name },
  //   { label: 'Date of Birth', key: 'dob', type: 'date', icon: <TodayIcon />, value: formData.dob },
  //   { label: 'Country', key: 'country', type: 'text', icon: <LanguageIcon />, value: formData.country, options: countries, inputBase: false }
  // ];

  const displayUnitsFields = [
    { label: 'Lift Mass', key: 'lift_weight', type: 'switch', value: formData.uom?.lift_weight, options: ['kg', 'lb'] },
    { label: 'Body Mass', key: 'body_mass', type: 'switch', value: formData.uom?.body_mass, options: ['kg', 'lb'] },
    { label: 'Length', key: 'length', type: 'select', value: formData.uom?.length, options: ['cm', 'in'] }
  ];

  return (
    
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap:'1rem', mt:'1rem' }}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', m:'1rem 0' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>Settings</Typography>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant='contained' color='secondary' disabled={!isFormChanged || isSaving} onClick={handleCancel}>Cancel</Button>
                <Button variant='contained' color='primary' disabled={!isFormChanged || isSaving} type='submit'>{isSaving ? 'Saving...' : 'Save'}</Button>
              </Box>
            </Box> 
            <Typography>Update your personal information or preferred units of measurement</Typography>
            <Root>
              <Divider sx={{ flexGrow: 1, marginLeft: 1, m:'1rem 0'}} orientation="horizontal" component="div" role="presentation" aria-hidden="true" />
            </Root>
            <SectionDivider sectionName={'PERSONAL INFORMATION'} />
            <Box  sx={{width:'100%', display:'flex', flexDirection:'column', gap:'2vh', m:'1rem 0'}}>
              <Paper 
                sx={{
                  display:'flex', 
                  alignItems:'center',
                  gap:'1rem', 
                  p: '2px 2px',
                  justifyContent: 'space-between',
                  width: '100%',
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: '#D9D9DE',
                  borderRadius: 1
                  }}>
                  <FormLabel
                      sx={{
                        flexGrow: 1,
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
                  First Name
                </FormLabel>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                <TextField 
                    sx={{ 
                      width:"70%",
                      '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: 'none', // Removes the border
                      },
                      '&:hover fieldset': {
                        border: 'none', // Removes the border on hover
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none', // Removes the border when focused
                      },
                    },
                  }} 
                  name={'first_name'} 
                  value={formData.first_name} 
                  onChange={handleChange}
                  variant="outlined" />
              </Paper>

              <Paper 
                sx={{
                  display:'flex', 
                  alignItems:'center',
                    gap:'1rem', 
                    p: '2px 2px',
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
                        flexGrow: 1,
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
                  Last Name
                </FormLabel>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> 
                <TextField 
                  sx={{ width:"70%",
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: 'none', // Removes the border
                      },
                      '&:hover fieldset': {
                        border: 'none', // Removes the border on hover
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none', // Removes the border when focused
                      },
                    },
                  }} 
                  name={'last_name'} 
                  value={formData.last_name} 
                  onChange={handleChange}
                  variant="outlined" />
              </Paper>

              <Paper sx={{ display: 'flex', alignItems: 'center', gap: '1rem', p: '2px 2px', justifyContent: 'space-between', width: '100%', boxShadow: 'none', border: '1px solid', borderColor: '#D9D9DE', borderRadius: 1 }}>
              <FormLabel sx={{ flexGrow: 1, color: '#3D3D3D', padding: '0% 2%' }}>
                DoB
              </FormLabel>
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <DesktopDatePicker
                format="yyyy/MM/dd"
                sx={{ width: '80%' }}
                defaultValue={formData.dob}
                onChange={handleDateChange}
                // renderInput={(params) => <TextField {...params} />}
              />
            </Paper>




              <Paper 
                  sx={{
                    display:'flex', 
                    alignItems:'center',
                      gap:'1rem', 
                      p: '2px 2px',
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
                        flexGrow: 1,
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
                  Country
                </FormLabel>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Autocomplete
                  sx={{ width:"70%", }}
                  id="auto-complete"
                  options={countries}
                  value={formData.country} // Ensure this value matches an option
                  onChange={(event, newValue) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      country: newValue || ''
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} name="country" variant="outlined"  
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none', // Removes the border
                        },
                        '&:hover fieldset': {
                          border: 'none', // Removes the border on hover
                        },
                        '&.Mui-focused fieldset': {
                          border: 'none', // Removes the border when focused
                        },
                      },
                    }}/>
                  )}
                />
              </Paper>

              <HeightInput
                addStyle={{ marginBottom: '2vh' }}
                id={'height'}
                placeholderText={''}
                options={[
                  { label: 'cm', value: 'metric' },
                  { label: ['ft', 'in'], value: 'imperial' }
                ]}
                defaultValue={formData.height || null} 
                defaultLabel={formData.uom?.height}
                onChangeToggle={handleHeightUOMChange}
                onChange={handleChange}
              />
            </Box>
            <SectionDivider sectionName={'DISPLAY UNITS'} />
            <Box width='100%' sx={{m:'1rem 0'}}> 
              {
                  displayUnitsFields.map((field) => (
                  <ToggleInput
                      key={field.key}
                      defaultValue={field.value}
                      fieldName={field.key}
                      addStyle={{ marginBottom: '2vh' }}
                      id={field.key}
                      inputLabel={field.label} 
                      options={field.options || []} 
                      inputValue={field.value}
                      onChange={handleUOMChange} // Adjust this to your handler
                  />
                  ))
              }
              </Box>
        </FormControl>
        </form>
    </Container>
  );
}

export default SettingsPage;
