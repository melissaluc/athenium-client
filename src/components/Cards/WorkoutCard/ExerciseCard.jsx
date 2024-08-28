import { useWorkoutContext } from '../../../Contexts/WorkoutContext';
import { UserDataContext } from '../../../Contexts/UserDataContext';
import { Box, Container, Stack, Typography, Button, Chip, IconButton, CardContent, Card, TextField} from "@mui/material"; 
// import { Edit } from '@mui/icons-material';
import {useState, useEffect, useContext} from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/system';
import ResultsModal from '../../Modals/ResultsModal';



function ExerciseCard ({exercise, handleExerciseChange}) {
    const theme = useTheme()
    const [completed, setCompleted] = useState(false)
const {editMode, workoutMode, calculateStrengthLevel, workoutData, deleteExercise, updateExercise} = useWorkoutContext();
    const {userData} = useContext(UserDataContext)
    const [formData, setFormData] = useState({
        id:exercise.id,
        exercise_name:exercise.exercise_name,
        category:exercise.category,
        group:exercise.group,
        weight:exercise.weight || 0,
        sets:exercise.sets || 0,
        reps:exercise.reps || 0,
        distance:exercise.distance || 0,
        duration :exercise.duration || 0,
    })
    const [openResults, setOpenResults] = useState(false)
    const [results, setResults] = useState(null)
    const [errorResults, setErrorResults] = useState(null);

    // useEffect(()=>{
    //     console.log('workoutMode: ',workoutMode)
    //     console.log('editMode: ',editMode)
    // },[workoutMode,editMode])

    useEffect(()=>{
        setCompleted(false)
    },[workoutMode])

    const handleSetComplete = ()=>{
        setCompleted(prev => !prev)
    }
    const handleClickStengthCalc = async () => {
        setOpenResults(true)
        const { exercise_name, weight, sets, reps } = exercise;
        console.log({ exercise_name, weight, sets, reps } )
        console.log('form Data',formData )
        console.log('workoutData',workoutData )
        try {
            const { result, error } = calculateStrengthLevel(exercise_name, weight, sets, reps);
            if (result) {
                setResults(result);
            } else {
                setErrorResults(error);
            }
        } catch (error) {
            console.error('Error in handleClickStengthCalc:', error);
            setErrorResults(true);
        }
    };
    
    const handleClickDeleteExercise = () => {
        deleteExercise(exercise.id); 
    };


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        
        // Update the local form data state
        setFormData(prevData => {
            const updatedData = {
                ...prevData,
                [name]: value,
            };
    
            // Call handleExerciseChange with updated data
            updateExercise(exercise.id,updatedData)
            handleExerciseChange(exercise.id, updatedData);
    
            return updatedData;
        });
        
    };
    



    return (
            <>  
                <ResultsModal open={openResults} handleClose={setOpenResults} results={results} error={errorResults}/>
                <Card 
                    sx={{
                        width:'90%',
                        border:`0.5px solid ${workoutMode && completed ? theme.palette.primary.main : '#D8D8D8'}`,
                        boxShadow: 'none',
                        borderRadius:'20px'
                        }}>
                    <CardContent>
                        <Box display={'flex'} sx={{justifyContent:'space-between', alignItems:'flex-start'}}> 
                            <Stack direction={'row'} spacing={{ xs: '1.5rem', sm: '3rem' }}>
                                <Box display={'flex'} alignItems='center'>
                                    <img src={exercise.img_url} alt={'sd'} layout="responsive" height='60%'/>
                                </Box>
                                <Box>
                                        <Chip size='small' label='novice'/>
                                    <Box>
                                        <Typography >{exercise.exercise_name}</Typography>
                                        <Typography fontSize={'0.8rem'} color='grey'>{exercise?.group}</Typography>
                                    </Box>

                                </Box>
                            </Stack>
                            {editMode ? <IconButton onClick={handleClickDeleteExercise} color='primary'><DeleteOutlineIcon/></IconButton> :
                            (workoutMode ? <IconButton onClick={handleSetComplete} color={completed ? 'primary' : 'default'}><AssignmentTurnedInIcon/></IconButton> : 
                            <Button onClick={handleClickStengthCalc} variant='contained' size='small'>Calc</Button>
                            )}
                        </Box>
            

                            <Stack 
                                direction='row' 
                                mt='1rem' 
                                spacing={1} 
                                justifyContent="center"
                                alignItems="center"
                                >
                            { exercise.category === 'strength' ?
                            <>
                                    <TextField
                                        
                                        id={`lift-${exercise.id}`}
                                        label={`Lift in ${userData.uom.lift_weight.uom}`}
                                        type="number"
                                        name={'weight'}
                                        value={formData.weight}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !(editMode || workoutMode),
                                        }}
                                        variant="filled"
                                        sx={{
                                            '& .MuiFilledInput-root': {
                                                    backgroundColor:'#f6f3f7',
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove the underline before input is focused
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove the underline after input is focused
                                                    },
                                                    '&:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none', // Remove the underline on hover
                                                    },
                                                    '&.Mui-focused:after': {
                                                        borderBottom: 'none', // Remove the underline when focused
                                                    },
                                        }}
                                        }
                                        
                                        />
                                    <TextField
                                        id={`reps-${exercise.id}`}
                                        label="Reps"
                                        type="number"
                                        name={'reps'}
                                        value={formData.reps}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !(editMode || workoutMode),
                                        }}
                                        variant="filled"
                                        sx={{
                                            '& .MuiFilledInput-root': {
                                                    backgroundColor:'#f6f3f7',
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove the underline before input is focused
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove the underline after input is focused
                                                    },
                                                    '&:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none', // Remove the underline on hover
                                                    },
                                                    '&.Mui-focused:after': {
                                                        borderBottom: 'none', // Remove the underline when focused
                                                    },
                                        }}
                                        }
                                        />
                                    <TextField
                                        id={`sets-${exercise.id}`}
                                        label="Sets"
                                        type="number"
                                        name={'sets'}
                                        value={formData.sets}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !(editMode || workoutMode),
                                        }}
                                        variant="filled"
                                        sx={{
                                            '& .MuiFilledInput-root': {
                                                backgroundColor:'#f6f3f7',
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove the underline before input is focused
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove the underline after input is focused
                                                    },
                                                    '&:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none', // Remove the underline on hover
                                                    },
                                                    '&.Mui-focused:after': {
                                                        borderBottom: 'none', // Remove the underline when focused
                                                    },
                                        }}
                                        }
                                        />
                            </> :
                                // Cardio
                                    <>
                                    <TextField
                                        id={`weight-${exercise.id}`}
                                        label={`Lift in ${userData.uom.lift_weight.uom}`}
                                        type="number"
                                        value={formData.weight}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !(editMode || workoutMode),
                                        }}
                                        variant="filled"
                                        sx={{
                                            '& .MuiFilledInput-root': {
                                                backgroundColor:'#f6f3f7',
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove the underline before input is focused
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove the underline after input is focused
                                                    },
                                                    '&:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none', // Remove the underline on hover
                                                    },
                                                    '&.Mui-focused:after': {
                                                        borderBottom: 'none', // Remove the underline when focused
                                                    },
                                        }}
                                        }
                                        
                                        />
                                    <TextField
                                        id={`duration-${exercise.id}`}
                                        label="Duration"
                                        type="number"
                                        value={formData.duration}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !(editMode || workoutMode),
                                        }}
                                        variant="filled"
                                        sx={{
                                            '& .MuiFilledInput-root': {
                                                backgroundColor:'#f6f3f7',
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove the underline before input is focused
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove the underline after input is focused
                                                    },
                                                    '&:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none', // Remove the underline on hover
                                                    },
                                                    '&.Mui-focused:after': {
                                                        borderBottom: 'none', // Remove the underline when focused
                                                    },
                                        }}
                                        }
                                        />
                                    <TextField
                                        id={`distance-${exercise.id}`}
                                        label="Distance"
                                        type="number"
                                        value={formData.distance}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !(editMode || workoutMode),
                                        }}
                                        variant="filled"
                                        sx={{
                                            '& .MuiFilledInput-root': {
                                                backgroundColor:'#f6f3f7',
                                                    '&:before': {
                                                        borderBottom: 'none', // Remove the underline before input is focused
                                                    },
                                                    '&:after': {
                                                        borderBottom: 'none', // Remove the underline after input is focused
                                                    },
                                                    '&:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none', // Remove the underline on hover
                                                    },
                                                    '&.Mui-focused:after': {
                                                        borderBottom: 'none', // Remove the underline when focused
                                                    },
                                        }}
                                        }
                                        />
                                    </>
            
                                
                                }
                            </Stack>

      

                    </CardContent>
                </Card>
            </>


    )
}

export default ExerciseCard;