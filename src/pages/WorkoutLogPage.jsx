import { Box, Container, Typography, Button, Card, CardActionArea, CardActions
,CardContent } from "@mui/material"; 
import CircularAvatar from "../components/CircularAvatar/CircularAvatar";
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import TuneIcon from '@mui/icons-material/Tune';
import SortPopover from "../components/Popovers/SortPopover";
import FilterPopover from "../components/Popovers/FilterPopover"
import WorkoutCard from "../components/Cards/WorkoutCard/WorkoutCard";

import workoutLogData from "../data/workouts.json"


import {useState} from 'react'


function WorkoutLogPage({}){
    const [originalWorkoutData, setOriginalWorkoutData] = useState(workoutLogData.workouts_log);
    const [workoutData, setWorkoutData] = useState(workoutLogData.workouts_log)
    
   
    const onSort = (order, category) => {
        handleSort(order, category)
    }
    const handleSort = (order, category) => {
        const sortedData = [...workoutData].sort((a, b) => {
            if (category === 'workout_name') {
                // String comparison
                return order === 'asc' ? a[category].localeCompare(b[category]) : b[category].localeCompare(a[category]);
            } else {
                // Numerical comparison
                return order === 'asc' ? a[category] - b[category] : b[category] - a[category];
            }
        });
        console.log(sortedData);
        setWorkoutData(sortedData);
    };
    
    const onFilter = (filterText) => {
        if (!filterText) {
            setWorkoutData(originalWorkoutData);
        } else {
            handleFilter(filterText)
        }
    }

    const handleFilter = (filterCriteria) => {
        const filteredData = workoutData.filter(item => item.workout_name === filterCriteria)
        setWorkoutData(filteredData);
    };
    

    return (
        <Container>
            {/* Header + Nav */}
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <Typography>Workouts</Typography>
                <DrawerNavBar/>
            </Box>


            {/* Filter + sort */}
            <Box sx={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                <FilterPopover buttonDisplay={<TuneIcon/>} data={workoutData} onFilter={onFilter}/>
                <SortPopover buttonDisplay={<SwapVertIcon/>} onSort={onSort}/>
            </Box>


            {/* Workout cards */}
            <Box sx={{display:'flex', flexDirection:'column', gap:"1rem"}}>
                {workoutData.map((data)=>{
                    return <WorkoutCard key={data.workout_id} data={data}/>
                })}
            </Box>
        </Container>
    )

}

export default WorkoutLogPage;