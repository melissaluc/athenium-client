import { Button, Typography, Container, Box } from '@mui/material';
import BodyAvatar from '../assets/Body'
import {useState, useEffect, useContext} from 'react'
import ParamsCard from '../components/Cards/ParamsCard/ParamsCard';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import userAvatar from "../assets/placeholderuseravatar.jpg"
import DeltaCards from '../components/Cards/DeltaCards/DeltaCards';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';
import MiniScheduleCard from '../components/Cards/ScheduleCard/ScheduleCard';
import axiosInstance from '../utils/axiosConfig';
import {findClosestData} from '../utils/utils'
import { UserDataContext } from '../UserDataContext';


function DashboardPage({}){
    const navigate = useNavigate()
    const {userData, setUserData }= useContext(UserDataContext);
    const [selectDate, setSelectDate] = useState(new Date())
    const [measurementData, setMeasurementData] = useState([]);
    const [selectMeasurementData, setSelectMeasurementData] = useState({});
    const [otherData, setOtherData] = useState(null)
    const [scheduleData, setScheduleData] = useState([])

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


    // // Current Schedule
    // useEffect(() => {
    //     axiosInstance.get(`/schedule?planned_on=${formattedDate}`)
    //         .then(response => {
    //             setScheduleData(response.data)
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }, [userData]);

    return (
        <Container sx={{}}>
            {/* Nav */}
            <DashboardHeader userAvatar={userAvatar} userData={userData}/>
            {/* Date selector */}
            <Box sx={{margin:'1.5rem 0rem'}}>
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
                                                                             
            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
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
                    sx={{display: "flex", alignItems:"center"}}
                >
                    {otherData && Object.entries(otherData.body_composition.delta).map(([key, value], index, array) => {
                        const { label, value: paramValue, uom } = value;
                        return (
                        <Box key={key} sx={{display: "flex", alignItems:"center", padding:'0rem', margin:"0rem" , width:'100%'}}>
                            <DeltaCards header={label} value={paramValue} units={uom}/>
                            {index !== array.length - 1 && <Box sx={{ borderRight: '1px solid black', height: "1.5rem", padding:"0rem", margin:"0rem", }}></Box>}
                        </Box>    
                )
                })
                }

                </Box>

                {/* Current params */}
                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: 'column', alignItems:'center', width:'100%' }}>
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
                        return <ParamsCard key={key} paramName={label} paramValue={paramValue} uom={uom} />;
                    })}


                    </Box>
                </Box>
            </Box>

            {/* Upcoming Activities: shows activities within 3 hours away in a 5 hour time block, or shows the next activity*/}
            {/* <Box>
                <Typography>Upcoming Activities Today</Typography>
                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                    <Typography>{new Date().toDateString()}</Typography>
                    <Button onClick={()=>navigate("../schedule")}>See more</Button> 
                </Box>
                <Box sx={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
                    
                    {dashData.schedule.map((item) => {
      
                    return <MiniScheduleCard key={item.id} data={item} />;
                })}

                </Box>
            </Box> */}

        </Container>
    )

}

export default DashboardPage;