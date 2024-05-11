import { Button, Typography, Container, Box, Card, CardContent, CardHeader, CardActionArea } from '@mui/material';
import BodyAvatar from '../assets/Body'
import {useState} from 'react'
import ParamsCard from '../components/Cards/ParamsCard/ParamsCard';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import dashData from "../data/dashboard.json"
import userAvatar from "../assets/placeholderuseravatar.jpg"
import DeltaCards from '../components/Cards/DeltaCards/DeltaCards';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useNavigate } from 'react-router-dom';
import MiniScheduleCard from '../components/Cards/MiniScheduleCard/MiniScheduleCard';


function DashboardPage({}){
    const navigate = useNavigate()
    const [selectDate, setSelectDate] = useState(new Date())
    // const [paramData, setParamData] = useState(dashData.data.params && null)
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

    return (
        <Container>
            {/* Nav */}
            <DashboardHeader userAvatar={userAvatar}/>
            {/* Date selector */}
            <Box>
                <Typography fontSize="0.8rem">From {selectDate.toLocaleDateString()}</Typography>
            </Box>
            {/* Avatar */}
            <Box sx={{display:'flex', justifyContent:'space-evenly'}}>
                <Button className="back-date" onClick={handleBackDateClick}>
                    <ArrowBackIosNewOutlinedIcon/>
                </Button>
                
                <BodyAvatar onClick={() => { navigate("../measurements") }} height="30vh"/>

                <Button className="forward-date" onClick={handleForwardDateClick} disabled={isToday(selectDate)}>
                    <ArrowBackIosNewOutlinedIcon sx={{transform: 'scaleX(-1)'}}/>
                </Button>
            </Box>

            {/* Param Cards*/}
            <Box>
            {/* Delta params */}
                <Box 
                    sx={{display: "flex", justifyContent:'space-evenly', alignItems:"center"}}
                >
                    {Object.entries(dashData.data.delta).map(([key, value], index, array) => {
                        const { label, value: paramValue, uom } = value;
                        return (
                        <Box key={key} sx={{display: "flex", justifyContent:'space-evenly', alignItems:"center"}}>
                            <DeltaCards header={label} value={paramValue} units={uom}/>
                            {index !== array.length - 1 && <Box sx={{ borderRight: '1px solid black', height: "1.5rem" }}></Box>}
                        </Box>    
                )
                })}

                </Box>

                {/* Current params */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap:'wrap',
                        gap:"1rem",
                        justifyContent:'space-evenly'
                    }}
                >

                {Object.entries(dashData.data.params).map(([key, value]) => {
                    const { label, value: paramValue, uom } = value;
                    return <ParamsCard key={key} paramName={label} paramValue={paramValue} uom={uom} />;
                })}


                </Box>
            </Box>

            {/* Upcoming Activities: shows activities within 3 hours away in a 5 hour time block, or shows the next activity*/}
            <Box>
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
            </Box>

        </Container>
    )

}

export default DashboardPage;