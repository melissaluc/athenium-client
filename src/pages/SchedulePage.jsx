import { Box, Container, Typography, Button} from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import Calendar from "../components/MeasurementForm/Calendar/Calendar"
import {useState, useEffect} from "react"
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

import ScheduleCard from "../components/Cards/ScheduleCard/ScheduleCard";
import axios from "axios";

function SchedulePage({}){
    const [selectDate, setSelectDate] = useState(new Date())
    const [scheduleData,setScheduleData] = useState([])

    useEffect(()=>{
        axios.get("http://localhost:5000/api/v1/schedule/39b17fed-61d6-492a-b528-4507290d5423/")
            .then(response=>{
                setScheduleData(response.data)
            })
            .catch(error=>console.error(error))
    },[])


    const handleBackDateClick = () => {
        const newDate = new Date(selectDate.getTime() - (24 * 60 * 60 * 1000));
        setSelectDate(newDate);
    };

    // Handle Forward date click but disables action beyond current date
    const handleForwardDateClick = () => {
        const newDate = new Date(selectDate.getTime() + (24 * 60 * 60 * 1000));
        setSelectDate(newDate);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
    };

    return (
        <Container>

            <Box sx={{display:'flex', flexDirection:'column'}}>
                <Box sx={{display:'flex', justifyContent:'center'}}>
                    <Button>+ Add</Button>
                    <Button>Edit</Button>
                </Box>
                <Box sx={{display:'flex', justifyContent:'space-evenly'}}>
                    <Button className="back-date" onClick={handleBackDateClick}>
                        <ArrowBackIosNewOutlinedIcon/>
                    </Button>
                    {/* <Typography>{selectDate.toDateString()}</Typography> */}
                    <Calendar setParentSelectDate={setSelectDate}/>

                    <Button className="forward-date" onClick={handleForwardDateClick} disabled={isToday(selectDate)}>
                        <ArrowBackIosNewOutlinedIcon sx={{transform: 'scaleX(-1)'}}/>
                    </Button>
                </Box>
            </Box>

            <Box sx={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
                
                {scheduleData.map((item) => {
                return <ScheduleCard key={item.uid} data={item} />;
            })}

        </Box>
        </Container>
    )

}

export default SchedulePage;