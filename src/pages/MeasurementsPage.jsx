import { Button, Typography, Container, Box } from '@mui/material';
import { border, flexbox } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MeasurementForm from '../components/MeasurementForm/MeasurementForm';
import DrawerNavBar from '../components/NavBar/DrawerNavBar/DrawerNavBar';
import GoalModal from '../components/GoalModal';


function MeasurementPage({}){
    const [waistHipRatio, setWaistHipRatio] = useState(null)
    const [inputValues, setInputValues] = useState({
        left: {
            Neck: 12,
            Chest: 34,
            Abdomen: 30,
            'L-Bicep': 12,
            'L-Upper Thigh': 21,
            'L-Thigh': 19,
            'L-Calf': 13,
        },
        right: {
            Shoulder: 36,
            Waist: 25,
            Hip: 36,
            'R-Bicep': 12,
            'R-Upper Thigh': 21,
            'R-Thigh': 19,
            'R-Calf': 13,
        },
    });
    
    const handleInputChange = (side, label, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [side]: {
                ...prevState[side],
                [label]: value,
            },
        }));
    };


    useEffect(()=>{
        setWaistHipRatio(inputValues["right"]["Waist"]/inputValues["right"]["Hip"])
    },[inputValues])
    


    const handleSubmit = (e) => {
        // Handle form submission and update backend data with inputValues
        console.log(`data submitted: \n ${JSON.stringify(inputValues)}`)
    };


    return (

        <Container
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent:'center',
                alignItems:"center",
                gap:"1rem",
            }}
        > 
            <Box
                sx={{
                    width: "100%",
                    typography: 'h1',
                    fontSize: { xs: '1rem', md: '3rem', lg: '4rem' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            {/* Title and navigation */}
            <Box 

            sx={{ 
                // border:"1px solid magenta",
                // height:"1rem",
                width: "100%",
                display: 'flex',
                justifyContent:'flex-end',
                alignItems:"center"
            
    
            }}
        >
            <DrawerNavBar />


        </Box>
            {/* TODO: Access backend user data to determine measurement units */}
            </Box>
            <Typography color='primary'>In Inches</Typography>
            {/* Input measurements in the form */}
            <MeasurementForm handleInputChange={handleInputChange} inputValues={inputValues} waistHipRatio={waistHipRatio}/>


            {/* Buttons Add a new measurement goal or Submit form */}
            <Box gap="0.5rem" display="flex" flexDirection="column" justifyContent="center" alignItems="center" width="100%">
                <GoalModal sx={{ width: '80%' }} values={{...inputValues.left,...inputValues.right}}/>
                {/* <Button onClick={()=>{handleSetGoal()}} variant='contained' sx={{ width: '80%' }}>+ Add Goal</Button> */}
                <Button onClick={handleSubmit}  sx={{ width: '80%' }}>Save</Button>

            </Box>
        </Container>
     
    )
            

}

export default MeasurementPage;