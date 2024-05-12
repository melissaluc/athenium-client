import { Box, Container, Typography, Button, Card, CardActionArea, CardActions
    ,CardContent } from "@mui/material"; 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



import ListItemExerciseCard from "./ListItemExerciseCard";

import { useState } from "react";


function WorkoutCard ({data}) {
    const [expandWorkout, setExpandWorkout] = useState(false)
    const date = new Date(data.last_completed*1000);
    const convertedDate = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });

    return(
        <Card>
        <CardContent>
            <Box>
                <Typography fontSize='0.7rem'>Last completed on {convertedDate}</Typography>
                <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <Typography>{data.workout_name}</Typography>
                    <Button>Edit</Button>
                </Box>
                <Box>
                    <Typography fontSize='0.7rem'>
                        {data.tags.join(" | ").toUpperCase()}
                    </Typography>
                </Box>
    
            </Box>
            {expandWorkout && 
            <Box>
                <Typography variant="body">
                    {data.description}
                </Typography>
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {data.exercises && data.exercises.map((item)=>{
                        return <ListItemExerciseCard data={item}/>
                    })}
                    
                </Box>

            </Box>}
        </CardContent>
        <CardActionArea sx={{
            width:'100%', 
            margin:'0px', 
            padding:'0px', 
            backgroundColor:'gray', 
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
            }}>
            <CardActions sx={{width:'100%', margin:'0px', padding:'0px'}}>
                <Button onClick={()=>{ setExpandWorkout(prev => !prev)}} sx={{width:'100%', margin:'0px', padding:'0px'}}><ArrowDropDownIcon sx={{transform: expandWorkout? 'scaleY(-1)': 'none'}}/></Button>
            </CardActions>
        </CardActionArea>
    </Card>
    )
}

export default WorkoutCard;