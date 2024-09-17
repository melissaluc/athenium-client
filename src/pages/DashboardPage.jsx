import { Button, Typography, Container, Box, Dialog, Slide, IconButton, Accordion, AccordionActions, AccordionSummary } from '@mui/material';
import BodyAvatar from '../assets/Body'
import {useState, useEffect, useContext, forwardRef} from 'react'
import ParamsCard from '../components/Cards/ParamsCard/ParamsCard';
import DeltaCards from '../components/Cards/DeltaCards/DeltaCards';
import SectionDivider from '../components/SectionDivider'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import {convertLbtoKg} from '../utils/utils'
import CloseIcon from '@mui/icons-material/Close';
import BodyCompositionForm from '../components/Forms/BodyCompositionForm';
import { useTheme } from '@mui/system';
import { useDashboardContext } from '../Contexts/DashboardContext';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });


function DashboardPage({}){
    const theme = useTheme()
    const navigate = useNavigate()
    const {
        handleBodyCompDialogClose,
        selectDate,
        handleBackDateClick,
        handleForwardDateClick,
        isToday,
        selectMeasurementData,
        openBodyCompDialog,
        handleClickBodyCompDialogOpen,
        otherData
    } = useDashboardContext();
 

    return (
        <Container sx={{}}>
            {/* Date selector */}
            <Box sx={{margin:'1.5rem 0rem'}}>
            <SectionDivider sectionName={'MEASUREMENTS'} />
                <Box>
                    <Typography fontSize="0.8rem">From {selectDate.toLocaleDateString('en-US', 
                                                                                        {
                                                                                            year: 'numeric',
                                                                                            month: 'long',
                                                                                            day: 'numeric'
                                                                                        })}
                    </Typography>
                </Box>
                {/* Avatar */}
                <Box sx={{display:'flex', justifyContent:'space-evenly', }}>
                    <Button className="back-date" onClick={handleBackDateClick}>
                        <ArrowBackIosNewOutlinedIcon/>
                    </Button>
                    
                    <BodyAvatar data={selectMeasurementData} onClick={() => { navigate("../measurements") }} height="30vh"/>

                    <Button className="forward-date" onClick={handleForwardDateClick} disabled={isToday(selectDate)}>
                        <ArrowBackIosNewOutlinedIcon sx={{transform: 'scaleX(-1)'}}/>
                    </Button>
                </Box>
            </Box>
            <SectionDivider sectionName={'BODY COMPOSITION'} actionComponent={
                <IconButton variant="outlined" color="primary" onClick={handleClickBodyCompDialogOpen}>
                    <AddCircleIcon/>
                </IconButton>}
                />
            <Dialog
                fullScreen
                open={openBodyCompDialog}
                onClose={handleBodyCompDialogClose}
                TransitionComponent={Transition}
            > 
                <Box sx={{ alignSelf:'center', display: 'flex', flexDirection:'column', alignItems:'center', p: 2, maxWidth:"smn", justifyContent:'center' }}>
                    <Button 
                        variant='contained' 
                        onClick={handleBodyCompDialogClose}
                        sx={{ 
                            width: '10vw', // Set the desired width
                            backgroundColor: '#e9dbff',
                            color: theme.palette.primary.main,
                            alignSelf:'flex-end'
                        }}
                    >
                    Cancel
                    </Button>
                    {/* <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleBodyCompDialogClose}
                    aria-label="close"
                    >
                        <CloseIcon />   
                    </IconButton> */}
                    <BodyCompositionForm/>
                </Box>
            </Dialog>
            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem'}}>
            {otherData && <Typography sx={{alignSelf:'flex-start'}} fontSize='0.8rem'>
                From {(new Date(otherData.body_composition.last_updated_on*1000)).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} to {(new Date(otherData.body_composition.updated_on*1000)).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Typography>}
            {/* Delta params */}
                <Box 
                    sx={{display: "flex", alignItems:"center", gap:"0.5rem",flexWrap:'wrap', justifyContent:'center' }}
                >
                    {otherData && Object.entries(otherData.body_composition.delta).map(([key, value], index, array) => {
                        const { label, value: paramValue, uom } = value;
                        let convertedValue =   paramValue
                        if(uom === 'kg'){
                            convertedValue = convertLbtoKg(paramValue)
                        }
                        return (
                            <DeltaCards header={label} value={convertedValue} units={uom}/>

                        )
                })
                }

                </Box>

                {/* Current params */}
                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: 'column', alignItems:'center', width:'100%', flexWrap:'wrap' }}>
                    {otherData && <Typography sx={{ alignSelf: 'flex-start' }} fontSize='0.8rem'>Last updated on {(new Date(otherData.body_composition.updated_on*1000)).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</Typography>}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap:'wrap',
                            gap:"1rem",
                            justifyContent:"center",
                            margin:'0.5rem 0rem 1rem 0rem'
                        }}
                    >

                    {otherData && Object.entries(otherData.body_composition.params).map(([key, value]) => {
                        const { label, value: paramValue, uom } = value;
                        let convertedValue =   paramValue
                        if(uom === 'kg'){
                            convertedValue = convertLbtoKg(paramValue)
                        }
                        return <ParamsCard key={key} paramName={label} paramValue={convertedValue} uom={uom} />;
                    })}


                    </Box>
                </Box>
            </Box>


        </Container>
    )

}

export default DashboardPage;