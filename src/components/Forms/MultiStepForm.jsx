import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, InputAdornment, Typography, Stepper, StepButton,MobileStepper, Step, StepLabel, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'
import UserInfo from './MultiStepForms/UserInfo';
import CurrentStats from './MultiStepForms/CurrentStats';
import ResultBmrBmi from './MultiStepForms/ResultBmrBmi';
import BodyFat from './MultiStepForms/BodyFat';
import LeanMuscleMass from './MultiStepForms/LeanMuscleMass'


function selectView (step, formData, handleParentFormChange) {
    const {username, password, confirm_password, email_address, dob, first_name, last_name, country, google_id, current_body_weight, gender,height_cm, bmr, bmi, body_fat_percentage, body_fat_view, newMeasurements, lean_muscle_mass, uom} = formData
    let data = {}
    switch(step){
        case 'personal_Info':
            data = {username, password, confirm_password, google_id, email_address, dob, first_name, last_name, country}
            return <UserInfo data={data} handleParentFormChange={handleParentFormChange}/>
        case 'current_stats':
            data = {current_body_weight, gender, height_cm,uom}
            return <CurrentStats data={data} handleParentFormChange={handleParentFormChange}/>
        case 'bmr_bmi':
            data =  {current_body_weight, height_cm, uom, dob, gender}
            return <ResultBmrBmi data={data} handleParentFormChange={handleParentFormChange}/>
        case 'body_fat':
            data =  {body_fat_percentage, body_fat_view, current_body_weight, height_cm,uom,newMeasurements}
            return <BodyFat data={data} handleParentFormChange={handleParentFormChange}/>
        case 'lean_muscle_mass': 
            data =  {lean_muscle_mass, body_fat_percentage, current_body_weight, height_cm, uom, gender }
            return <LeanMuscleMass data={data} handleParentFormChange={handleParentFormChange}/>
        default:
            return null
    }
}


const MultiStepForm = ({userCredentials, setIsComplete, setUserData}) => {
    const theme = useTheme()

    const steps = ['personal_Info','current_stats', 'bmr_bmi', 'body_fat','lean_muscle_mass'];
    const stepTitle = {
        'personal_Info':'Personal Information',
        'current_stats':'Stats', 
        'bmr_bmi':'Results BMI & BMR',
        'body_fat':'Body Fat %',
        'lean_muscle_mass':'Results Fat Free Mass & FFMI '
    }

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({

        // Personal Information
        username:userCredentials.username || null,
        password:userCredentials.password || null,
        confirm_password:userCredentials.confirm_password,
        email_address: userCredentials.email_address || "",
        dob: userCredentials.dob || '',
        first_name: userCredentials.first_name || '',
        last_name:userCredentials.last_name || '',
        country: userCredentials.country || '',
        google_id: userCredentials.google_id || null,
        // Current Stats
        current_body_weight:'',
        height_cm:'',
        gender:'',
        // Calculate BMR and ask user if it looks correct, allow user to manually change
        bmr:'',
        bmi:'',
        // Determine Body Fat: method 1) user manual input | method 2) using visual reference | method 3) calculate based on measurements | method 4) from muscle mass
        body_fat_percentage:'',
        body_fat_view:null,
        newMeasurements:{},
        lean_muscle_mass:'',
        // Set user preferred units
        uom:{
            body_mass:'kg',
            lift_weight:'kg',
            height:'cm',
            girth_measurements:'cm',

        },
        // Misc
        profile_img: userCredentials.profile_img || '',

    })

    // const uom_options = {
    //     body_mass:['kg','lb'],
    //     lift_weight:['kg','lb'],
    //     lean_muscle_mass:['kg','lb'],
    //     height:['cm','in','ft'],
    //     girth_measurements:['cm','in'],
    // }


    const handleNext = () => {
        setActiveStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevStep => prevStep - 1);
    };

    const handleChange  = (newData) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            ...newData
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`,{action:'submit', userData: formData})
        .then((response)=>{
            console.log(response)
            if(response.data.success){
                setUserData(prev => ({ ...prev, ...formData }))
                setIsComplete(true)
            }
        })
        .catch(error=>{
            console.error(error)
        })
    };

    useEffect(()=>{
        console.log('MultiStepForm: ',formData)
    },[formData])


    return(
        <Box sx={{ width: '100%', height:'100vh', mx: 'auto', mt: 0 , display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between'}}>
            <Typography textAlign='center' variant='h4' color='black' paddingBottom='2vh'>{stepTitle[steps[activeStep]]}</Typography>
            <Box sx={{ maxWidth: '100%', p: 2 , display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem'}}>
                {selectView (steps[activeStep], formData, handleChange)}
            </Box>
            <MobileStepper
            variant="progress"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{ width:'50vw',  mb:'2vh' }}
            nextButton={
                activeStep === steps.length - 1 ? (
                    <Button
                        size="small"
                        // variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ m: '0.5rem' }}
                    >
                        Submit
                    </Button>
                ) :
                <Button size="small" sx={{ m: '0.5rem' }} onClick={handleNext} disabled={activeStep === steps.length}>
                Next
                {
                    <KeyboardArrowRight />
                }
                </Button>
            }
            backButton={
                <Button size="small" sx={{ m: '0.5rem' }} onClick={handleBack} disabled={activeStep === 0}>
                {
                    <KeyboardArrowLeft />
                }
                Back
                </Button>
            }
            />
        </Box>
    )


}


export default MultiStepForm;