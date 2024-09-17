import {Typography, Container, TextField, Paper, Divider, FormLabel, Button, Stack} from '@mui/material';
import { useState, useContext } from 'react';
import { UserDataContext } from '../../Contexts/UserDataContext';
import { useDashboardContext } from '../../Contexts/DashboardContext';
import axiosInstance from '../../utils/axiosConfig';
import {convertLbtoKg} from '../../utils/utils';
import { useTheme } from '@mui/system';

function BodyCompositionForm() {
    const theme = useTheme();
    const { handleBodyCompDialogClose } = useDashboardContext();
    const { userData, setUserData } = useContext(UserDataContext);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        body_fat: '',
        body_weight: ''
    });

    const calculateBmrBmi = () => {
        const height = userData.height_cm;
        const weight = convertLbtoKg(userData.weight);

        const bmi = weight / Math.pow(height / 100, 2);
        const bmr = Math.round(
            (10 * weight) +
            (6.25 * height) - 
            (5 * userData.age) +
            (userData.gender === 'male' ? 5 : -161)
        );
        setFormData(prev => ({ ...prev, bmr, bmi }));
        return { bmr, bmi };
    };

    const calculateffmi = () => {
        const bodyFatDecimal = formData.body_fat / 100;
        const bodyFatMass = formData.body_weight * bodyFatDecimal;
        const calculatedLeanMuscleMass = formData.body_weight - bodyFatMass;
        const weightInKg = convertLbtoKg(calculatedLeanMuscleMass) * 0.453592;
        const heightInM = userData.height_cm / 100;
        const calculatedFFMI = weightInKg / (heightInM * heightInM);

        return {
            lean_muscle_mass: calculatedLeanMuscleMass,
            ffmi: calculatedFFMI
        };
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { bmr, bmi } = calculateBmrBmi();
            const { lean_muscle_mass, ffmi } = calculateffmi();
            await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/body-composition`, { ...formData, bmr, bmi, lean_muscle_mass, ffmi });
            setIsSaving(false);
            setUserData(prev => ({ ...prev, weight: formData.body_weight }));
            handleBodyCompDialogClose();
        } catch (error) {
            console.error(error);
            setIsSaving(false);
        }
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const selectDate = new Date();
    const formattedSelectDate = selectDate.toLocaleDateString('en-US', options);

    return (
        <Container maxWidth="sm">
            <Stack direction='column' spacing='1rem'>
                <Typography fontWeight='bold'>BODY COMPOSITION</Typography>
                <Typography>{formattedSelectDate}</Typography>
                <form onSubmit={handleSave}>
                    <Stack direction='column' spacing='1rem' alignItems='center'>
                        <Paper
                            sx={{
                                p: '2px 2px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                boxShadow: 'none',
                                border: '1px solid',
                                borderColor: '#D9D9DE',
                                borderRadius: 1
                            }}>
                            <FormLabel
                                sx={{
                                    color: '#3D3D3D',
                                    padding: '0% 2%',
                                    fontSize: '0.8rem',
                                    '&.MuiFormLabel-root': {
                                        color: '#3D3D3D',
                                    },
                                    '&.Mui-focused': {
                                        color: '#3D3D3D',
                                    },
                                }}>
                                BODY WEIGHT
                            </FormLabel>
                            <TextField
                                type='number'
                                value={formData.body_weight}
                                onChange={handleOnChange}
                                name='body_weight'
                                sx={{ flexGrow: '1' }} />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Typography fontWeight='bold' sx={{ p: '0 1rem', color: theme.palette.primary.main }}>{userData.uom.body_mass.uom}</Typography>
                        </Paper>
                        <Paper
                            sx={{
                                p: '2px 2px',
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                boxShadow: 'none',
                                border: '1px solid',
                                borderColor: '#D9D9DE',
                                borderRadius: 1
                            }}>
                            <FormLabel
                                sx={{
                                    color: '#3D3D3D',
                                    padding: '0% 2%',
                                    fontSize: '0.8rem',
                                    '&.MuiFormLabel-root': {
                                        color: '#3D3D3D',
                                    },
                                    '&.Mui-focused': {
                                        color: '#3D3D3D',
                                    },
                                }}>
                                BODY FAT
                            </FormLabel>
                            <TextField
                                type='number'
                                value={formData.body_fat}
                                onChange={handleOnChange}
                                name='body_fat'
                                sx={{ flexGrow: '1' }} />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Typography fontWeight='bold' sx={{ p: '0 1rem', color: theme.palette.primary.main }}>%</Typography>
                        </Paper>
                    </Stack>
                    <Button fullWidth variant='contained' type='submit' disabled={isSaving}>{!isSaving ? 'Save' : 'Saving...'}</Button>
                </form>
            </Stack>
        </Container>
    );
}

export default BodyCompositionForm;
