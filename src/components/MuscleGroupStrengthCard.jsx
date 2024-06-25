import { Box,  Typography, Card,CardContent, CardActionArea, CardActions, Button} from "@mui/material";
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExerciseStrengthLevel from "./ExerciseStrengthLevel";
import { useTheme } from "@emotion/react";


function MuscleGroupStrengthCard ({muscleGroup, exercises, groupScore}) {
    const theme = useTheme()
    const [expandWorkout, setExpandWorkout] = useState(false)

    return(

        <Card key={muscleGroup} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%' }}>
            <CardContent>
                <Box sx={{display:'flex', justifyContent:'space-around'}}>
                    <Typography>{groupScore}</Typography>
                    <Typography>{muscleGroup}</Typography>
                </Box>
                {expandWorkout && 
                
                <>
                {exercises.map((exercise)=>{
                    const {
                        date_calculated,
                        exercise_name,
                        group,
                        body_weight,
                        relative_strength_demographic,
                        one_rep_max,
                        reps,
                        lift,
                        strength_level,
                        next_strength_level,
                        strength_bounds,
                        score,
                        img_url
                        } = exercise
    
                    return <ExerciseStrengthLevel
                    key={exercise_name}
                    date_calculated={date_calculated}
                    exercise_name={exercise_name}
                    group={group}
                    body_weight={body_weight}
                    relative_strength_demographic={relative_strength_demographic}
                    one_rep_max={one_rep_max}
                    reps={reps}
                    lift={lift}
                    strength_level={strength_level}
                    next_strength_level={next_strength_level}
                    strength_bounds={strength_bounds}
                    score={score}
                    img_url={img_url}
                            />
                })
                }
            </>            

                }
            </CardContent>
            <CardActionArea sx={{
                height:'4vh',
                width:'100%', 
                margin:'0px', 
                backgroundColor:theme.palette.secondary.main, 
                opacity:"40%",
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