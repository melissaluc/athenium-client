import { Button, Typography, Container, Box, Dialog, Slide, IconButton, Accordion, AccordionActions, AccordionSummary } from '@mui/material';
import BodyAvatar from '../assets/Body'
import {useState, useEffect, useContext, forwardRef} from 'react'
import ParamsCard from '../components/Cards/ParamsCard/ParamsCard';
import DeltaCards from '../components/Cards/DeltaCards/DeltaCards';
import SectionDivider from '../components/SectionDivider'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import {findClosestData} from '../utils/utils'
import { UserDataContext } from '../Contexts/UserDataContext';
import {convertLbtoKg} from '../utils/utils'
import CloseIcon from '@mui/icons-material/Close';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });


function DashboardPage({}){
    const navigate = useNavigate()
    const {userData, setUserData }= useContext(UserDataContext);
    const [selectDate, setSelectDate] = useState(new Date())
    const [measurementData, setMeasurementData] = useState([]);
    const [selectMeasurementData, setSelectMeasurementData] = useState({});
    const [otherData, setOtherData] = useState(null)
    const [openBodyCompDialog, setOpenBodyCompDialog] = useState(false);

    const handleClickBodyCompDialogOpen = () => {
        setOpenBodyCompDialog(true);
      };
    
      const handleBodyCompDialogClose = () => {
        setOpenBodyCompDialog(false);
      };

    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10); // Get YYYY-MM-DD format

    const handleBackDateClick = () => {
        const newDate = new Date(selectDate.getTime() - (24 * 60 * 60 * 1000));
        setSelectDate(newDate);
    };

    // Handle Forward date click but disables action beyond current date
    const handleForwardDateClick = () => {
        const newDate = new Date(selectDate.getTime() + (24 * 60 * 60 * 1000));
        setSelectDate(newDate);
    };
    // console.log(dashData.data.params)
    const isToday = (date) => {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
    };

    useEffect(()=>{
        const selectDateOnly = new Date(selectDate.getFullYear(), selectDate.getMonth(), selectDate.getDate());

        const currentMeasurement = measurementData.filter(measurement => {
            // Convert measurement.created_on to a Date object with only year, month, and day
            const measurementDateOnly = new Date(measurement.created_on);
            measurementDateOnly.setHours(0, 0, 0, 0); // Ensure we compare only the date part
          
            // Compare the date parts
            return measurementDateOnly.getTime() === selectDateOnly.getTime();
          });

        if(!currentMeasurement.length) {
            const closestMeasurement = findClosestData(selectDate, measurementData)
            setSelectMeasurementData(closestMeasurement)
        } else {
            console.log('currentMeasurement: ',currentMeasurement)
            setSelectMeasurementData(currentMeasurement[0])      
        }

    },[selectDate,measurementData])

    // Measurements
    useEffect(() => {
        axiosInstance.get(`/measurements`)
            .then(response => {
                setMeasurementData(response.data); 
            })
            .catch(error => {
                console.log(error);
            });
    }, [userData]);

    // Other dashboard data
    useEffect(() => {
        axiosInstance.get(`/dashboard`)
            .then(response => {
                setOtherData(response.data); 
            })
            .catch(error => {
                console.log(error);
            });
    }, [userData]);


 

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
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleBodyCompDialogClose}
                aria-label="close"
                >
                <CloseIcon />
                </IconButton>
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
                        if(uom !== 'lb'){
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
                        if(uom !== 'lb'){
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