import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea, CardActions, Button} from "@mui/material";
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import StrengthLevelExerciseList from "./StrengthLevelExerciseList";


function MuscleGroupStrengthCard ({muscleGroup, exercises}) {

    const [expandWorkout, setExpandWorkout] = useState(false)

    return(

        <Card key={muscleGroup} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
            <CardContent>
                <Box sx={{display:'flex', justifyContent:'space-around'}}>
                    <Typography>Score</Typography>
                    <Typography>{muscleGroup}</Typography>
                </Box>
                {expandWorkout && 
                <StrengthLevelExerciseList data={exercises}/>
                }
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
                    <Button onClick={()=>{ setExpandWorkout(prev => !prev)}} sx={{width:'100%', margin:'0px', padding:'0px'}}>
             
                            <ArrowDropDownIcon sx={{transform: expandWorkout? 'scaleY(-1)': 'none'}}/>
            
                    </Button>
                </CardActions>
            </CardActionArea>
        </Card>
                
    )
}

export default MuscleGroupStrengthCard;