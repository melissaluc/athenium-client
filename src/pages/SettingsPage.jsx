import { Typography, Button, Box, Container, Divider, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import CustomInput from "../components/Forms/InputFields/CustomInput";
import HeightInput from "../components/Forms/InputFields/HeightInput";
import { UserDataContext } from '../Contexts/UserDataContext';
import { useState, useContext, useEffect } from 'react';
import SectionDivider from "../components/SectionDivider";
import axios from 'axios';
import OptionsInput from "../components/Forms/InputFields/OptionsInput";
import ToggleInput from "../components/Forms/InputFields/ToggleInput";
import TodayIcon from '@mui/icons-material/Today';
import LanguageIcon from '@mui/icons-material/Language';

function SettingsPage() {
  const { userData } = useContext(UserDataContext);
  const [formData, setFormData] = useState({});
  const [countries, setCountries] = useState([]);
  const theme = useTheme();

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
  useEffect(() => {
    setFormData(userData);  // Populate initial form data with userData
    console.log(userData)
  }, [userData]);

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

  const personalInfoFields = [
    { label: 'First Name', key: 'first_name', type: 'text', value: formData.first_name },
    { label: 'Last Name', key: 'last_name', type: 'text', value: formData.last_name },
    { label: 'Date of Birth', key: 'dob', type: 'date', icon: <TodayIcon />, value: formData.dob },
    { label: 'Country', key: 'country', type: 'text', icon: <LanguageIcon />, value: formData.country, options: countries, inputBase: false }
  ];

  const displayUnitsFields = [
    { label: 'Lift Mass', key: 'lift_mass', type: 'switch', value: formData.uom?.lift_weight?.uom, options: ['kg', 'lb'] },
    { label: 'Body Mass', key: 'body_mass', type: 'switch', value: formData.uom?.body_mass?.uom, options: ['kg', 'lb'] },
    { label: 'Length', key: 'length', type: 'select', value: formData.uom?.girth_measurements?.uom, options: ['cm', 'in'] }
  ];

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap:'1rem', mt:'1rem' }}>
      <Box sx={{ width: '90%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>Settings</Typography>
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant='contained' color='secondary' disabled={true}>Cancel</Button>
          <Button variant='contained' color='primary' disabled={true}>Save</Button>
        </Box>
      </Box>
      <Typography>Update your personal information or preferred units of measurement</Typography>
      <Root>
        <Divider sx={{ flexGrow: 1, marginLeft: 1 }} orientation="horizontal" component="div" role="presentation" aria-hidden="true" />
      </Root>
      <SectionDivider sectionName={'PERSONAL INFORMATION'} />
      <Box  sx={{width:'90%'}}>
        {
          personalInfoFields.map((field) => (
            <OptionsInput
              key={field.key}
              inputBase={field.inputBase}
              fieldName={field.key}
              addStyle={{ marginBottom: '2vh' }}
              id={field.key}
              inputLabel={field.label}
              options={field.options || null}
              defaultValue={field.key === 'country' ? field.value : null}
              inputValue={field.value}
              icon={field.icon || null}
            />
          ))
        }
        <HeightInput
          addStyle={{ marginBottom: '2vh' }}
          id={'height'}
          placeholderText={''}
          options={[
            { label: 'cm', value: 'metric' },
            { label: ['ft', 'in'], value: 'imperial' }
          ]}
          defaultValue={userData.height_cm || null} 
          defaultLabel={formData.uom?.height?.uom}
          onChangeToggle={handleHeightUOMChange}
          onChange={handleChange}
        />
      </Box>
      <SectionDivider sectionName={'DISPLAY UNITS'} />
      <Box width='90%'> 
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
                // onChangeSelect={handleUOMChange} // Adjust this to your handler
            />
            ))
        }
        </Box>

    </Container>
  );
}

export default SettingsPage;
