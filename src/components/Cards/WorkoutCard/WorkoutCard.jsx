import { Box, Typography, Button, Card, CardActionArea, CardActions, CardContent, 
    Chip, Stack,
    List, ListItem, Grid, ListItemText, 
    ImageListItem} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useNavigate} from 'react-router-dom'
import {useState} from "react";
import { useTheme } from "@emotion/react";
import { format, parseISO } from 'date-fns';
import { unixToLocal } from "../../../utils/utils";


function WorkoutCard({ 
                        workout, 
                         }) {
    const [expandWorkout, setExpandWorkout] = useState(false);

    const theme = useTheme();
    const navigate = useNavigate()
   


    return (
        <Card width='100%' sx={{border:'1px solid #D9D9DE'}}>
            <CardContent >
                <Box display='flex' sx={{justifyContent:'space-between'}}>
                    <Chip 
                        size='small'
                        label='unknown'
                        />
                    {workout.last_completed && 
                        <Stack direction='column' pb={'1rem'}>
                            <Typography fontSize={'0.7rem'}>Last Completed</Typography>
                            <Typography fontSize={'0.7rem'}>{unixToLocal(workout.last_completed)}</Typography>
                        </Stack>
                    }
                </Box>
                <Box display='flex' sx={{justifyContent:'space-between'}}>
                    <Box>
                        <Typography fontSize={'1.5rem'} fontWeight={''}>{workout.workout_name}</Typography>
                        <Typography fontSize={'0.8rem'}>{workout.exercises?.length || 0} Exercises</Typography>
                    </Box>
                    <Button variant='outlined' onClick={()=>{navigate(`/workouts/${workout.workout_id}`)}}>View</Button>
                </Box>
                { expandWorkout && 
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <List>
                            {workout.exercises.map(exercise => {
                                return (
                                    <ListItem style={{ display: 'flex', alignItems: 'center', gap:'2rem' }}>
                                        <ImageListItem>
                                            <img
                                                src={exercise.img_url}
                                                alt={exercise.exercise_name}
                                                layout="responsive"
                                                // height={75}
                                            />
                                        </ImageListItem>
                                        <ListItemText
                                            primary={exercise.exercise_name}
                                            secondary={exercise.group}
                                        />
                                    </ListItem>
                                )
                            })
                            }
                            </List>
                        </Grid>
                    </Grid>

                }
            </CardContent>
            {
                workout.exercises?.length> 0 && 
                <CardActionArea sx={{
                    width: '100%',
                    margin: '0px',
                    padding: '0px',
                    backgroundColor: theme.palette.secondary.main,
                    opacity: "40%",
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0
                }}>
                    <CardActions sx={{ width: '100%', margin: '0px', padding: '0px' }}>
                        <Button onClick={() => setExpandWorkout(prev => !prev)} sx={{ width: '100%', margin: '0px', padding: '0px' }}><ArrowDropDownIcon sx={{ transform: expandWorkout ? 'scaleY(-1)' : 'none' }} /></Button>
                    </CardActions>
                </CardActionArea>
            }
        </Card>
    );
}

export default WorkoutCard;
