import { Box,  Typography, Card,CardContent, CardActionArea, CardActions, Button, Rating, Stack, Divider} from "@mui/material";
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExerciseStrengthLevel from "./ExerciseStrengthLevel";
import { useTheme } from "@emotion/react";


function MuscleGroupStrengthCard ({muscleGroup, exercises, groupScore}) {
    const theme = useTheme()
    const [expandWorkout, setExpandWorkout] = useState(false)

    return(

        <Card key={muscleGroup} sx={{ display: 'flex', flexDirection: 'column',width:'100%'}}>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection:'column',justifyContent:'space-between'}}>
                    <Box sx={{ display: 'flex', flexDirection:'column', mb:{ xs: '10%', sm: '10%', md: '15%' }}} >
                        <Typography fontSize='2rem'>{muscleGroup}</Typography>
                        <Stack direction='row' spacing='0.5rem' alignItems={'center'}>
                            <Rating name="read-only" value={groupScore} precision={0.5} readOnly />
                            <Typography variant='h6'>{groupScore}</Typography>   
                        </Stack>
                    </Box>
                    <Typography fontSize={'0.8rem'}>{exercises?.length || 0} Exercises</Typography>
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
                        sets,
                        img_url
                        } = exercise
                        
                    return (
                        <Box>
                            <Divider sx={{ flexGrow: 1, marginLeft: 1, pt:'1rem' }} orientation="horizontal" component="div" role="presentation" aria-hidden="true" />
                            <Box pt='1rem'>
                                <ExerciseStrengthLevel
                                        key={exercise_name}
                                        date_calculated={date_calculated}
                                        exercise_name={exercise_name}
                                        group={group}
                                        body_weight={body_weight}
                                        relative_strength_demographic={relative_strength_demographic}
                                        one_rep_max={one_rep_max}
                                        reps={reps}
                                        lift={lift}
                                        sets={sets}
                                        strength_level={strength_level}
                                        next_strength_level={next_strength_level}
                                        strength_bounds={strength_bounds}
                                        score={score}
                                        img_url={img_url}
                                                />
                            </Box>
                        </Box>
                    )
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