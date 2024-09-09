import { useWorkoutContext } from '../Contexts/WorkoutContext';
import { useParams,useNavigate } from "react-router-dom";
import { Box, Container, Stack, Typography, Button, Chip, CardContent, Card, TextField, Skeleton} from "@mui/material"; 
import { Edit } from '@mui/icons-material';
import {useState, useEffect, useRef} from 'react'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ExerciseCard from '../components/Cards/WorkoutCard/ExerciseCard'
import { useTheme } from '@mui/system';
import ExerciseModal from '../components/Modals/ExerciseModal'
import { unixToLocal } from '../utils/utils';


function WorkoutDetailPage() {
    const { id: workout_id } = useParams();
    const [isDisabled, setIsDisabled] = useState(false);
    const theme = useTheme()
    const formRef = useRef(null);
    const navigate = useNavigate()
    const [openAddExerciseModal, setOpenAddExerciseModal] = useState(false);
    const {workoutData, deleteWorkout, updateWorkout, setWorkoutMode, activeWorkoutData, setEditMode, editMode, workoutMode, getWorkoutById} = useWorkoutContext();
    const [workoutDetailForm, setWorkoutDetailForm] = useState({
        description: activeWorkoutData.description || '',
        workout_name: activeWorkoutData.workout_name || '',
        exercises:activeWorkoutData.exercises || [],
        last_completed:activeWorkoutData.last_completed || null,
        frequency:activeWorkoutData.frequency || 0
    })

    useEffect(() => {
        if (activeWorkoutData && (!editMode | !workoutMode )) {
            setWorkoutDetailForm({
                description: activeWorkoutData.description || '',
                workout_name: activeWorkoutData.workout_name || '',
                exercises: activeWorkoutData.exercises || [],
            });
        }
        console.log(activeWorkoutData)
    }, [activeWorkoutData, workoutData]);

    const handleOpenAddExercise = () => {
        setOpenAddExerciseModal(true)
    };
    const handleCloseAddExercise = () => {
        setOpenAddExerciseModal(false)
    };
    useEffect(()=>{
        console.log('Getting workout data for :',workout_id)
        getWorkoutById(workout_id)
    },[workout_id])

    const disableButton = () => {

        setIsDisabled(true);
    
        setTimeout(() => {
          setIsDisabled(false);
        }, 2000); 
      };

    const handleTopButton = () => {
        if(!editMode & !workoutMode){
            // Edit workout
            setEditMode(prev => !prev);
        } else if (workoutMode){
            // Cancel workout
            setWorkoutMode(prev => !prev);
            // Keep user changes
        } else if (editMode){
            // Cancel edit
            disableButton()
            setEditMode(prev => !prev);
            // remove user changes
        } 
    };

    // Handler to toggle workout mode
    const handleCardButton = async () => {
        if (!editMode && !workoutMode) {
            // Start Workout
            setWorkoutMode(prev => !prev);
        } else if (workoutMode) {
            disableButton()
            // Finish Workout
            // Save any changes to lift, reps, sets
            setWorkoutMode(prev => {
                formRef.current.requestSubmit();
                const newMode = !prev;
                return newMode;
            });
        } else if (editMode) {
            // Delete Workout
            try {
                await deleteWorkout(workout_id); 
                setEditMode(prev => {
                    const newMode = !prev;
                    navigate('/workouts'); 
                    return newMode;
                });
            } catch (error) {
                console.error('Error deleting workout:', error);
   
            }
        }
    };
    


    const handleBottomButton = () =>{
        disableButton()
        if(workoutMode){
            setWorkoutMode(prev => {
                const newMode = !prev;
                
                navigate('/workouts');
                return newMode;
            })
        } else if (editMode){
            setEditMode(prev => {
                formRef.current.requestSubmit(); 
                const newMode = !prev;
                return newMode;
            })
        } else {
            navigate('/workouts')
        }


    }


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setWorkoutDetailForm(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    
    const handleExerciseChange = (exerciseId,updatedExercise) => {
        console.log('handle exercise changes updatedExercise: ', updatedExercise);
        
        setWorkoutDetailForm(prevData => {
            const updatedExercises = prevData.exercises.map(exercise => 
                exercise.id === exerciseId 
                    ? { ...exercise, ...updatedExercise }
                    : exercise
            );
    
            // Log the updated exercises immediately
            console.log('Updated exercises:', updatedExercises);
    
            return {
                ...prevData,
                exercises: updatedExercises
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
    
        try {

            const completed_on_dt = Date.now(); // milliseconds
            const completed_on_dt_in_seconds = Math.floor(completed_on_dt / 1000);
            const updatedWorkoutDetails = editMode
                ? workoutDetailForm
                : {
                    ...workoutDetailForm,
                    // TODO: fix this
                    frequency: workoutDetailForm.frequency ? parseInt(workoutDetailForm.frequency) + 1 : 1,
                    last_completed: completed_on_dt_in_seconds
                };
    
            await updateWorkout(updatedWorkoutDetails);

            setEditMode(false);
            setWorkoutMode(false);
    
        } catch (error) {
            console.error('Error during workout update:', error);
 
        }
    };



    return (
        <Container
            sx={{
                // display: 'flex',
                // flexDirection: 'column',
                // minHeight: '100vh',
                paddingTop:'2%',
                paddingBottom: '20vh',
                maxWidth:'500px'
            }}
        >   
            <ExerciseModal workoutDetailForm={workoutDetailForm} handleClose={handleCloseAddExercise } open={openAddExerciseModal}/>
            <form ref={formRef} onSubmit={ handleSubmit}>
                <Box
                    // spacing={'1rem'} 
                    // paddingBottom={'2%'} 
                    // direction='column' 
                    display='flex'
                    gap='0.8rem'
                    flexDirection={'column'}
                    justifyContent="center"
                    alignItems="center"
                >

                    <Button 
                        onClick={handleTopButton}
                        sx={{
                            backgroundColor: editMode ? '#e9dbff' : theme.palette.primary.main,
                            color: editMode ? theme => theme.palette.primary.main : 'white',
                            flexGrow: 1, // Ensure the button grows to fill space
                        }} 
                        fullWidth 
                        variant='contained'
                        >
                        {!(editMode || workoutMode)? 'Edit' : 'Cancel'}
                    </Button>
                    <Card 
                        sx={{
                            boxShadow: 'none',
                            width:'100%'
                            }}>
                        <CardContent >
                            <Box padding='0 1rem'>
                                <Box display='flex' sx={{justifyContent:'space-between'}} >
                                    <Chip 
                                        size='small'
                                        label='novice'
                                    />
                                    {activeWorkoutData.last_completed && 
                                        <Stack direction={'column'}>
                                            <Typography fontSize={'0.7rem'}>Last completed</Typography>
                                            <Typography fontSize={'0.7rem'}>{unixToLocal(activeWorkoutData.last_completed)}</Typography>
                                        </Stack>
                                        }
                                </Box>
                                <Box display='flex' sx={{justifyContent:'space-between', height:'10vh', alignItems:'flex-start', pt:'0.8rem'}}>
                                    <Box display='flex' sx={{flexDirection:'column', justifyContent:'space-between', flexGrow: 1,}}>
                                    <TextField
                                        type="text"
                                        name={'workout_name'}
                                        label={editMode ? 'Workout Name' : ''}
                                        value={workoutDetailForm.workout_name}
                                        onChange={handleOnChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: !editMode,
                                        }}
                                        variant="outlined"
                                        sx={{
                                            width:'90%',
                                            '& .MuiOutlinedInput-root': {
                                                // Styles for the root of the outlined input
                                                '& fieldset': {
                                                    borderColor: editMode ? 'grey' : 'transparent', // Adjust border color based on edit mode
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: editMode ? 'grey' : 'transparent', // Adjust border color on hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: editMode ? 'grey' : 'transparent', // Adjust border color when focused
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                // Styles for the input label
                                                color: editMode ? 'black' : 'grey', 
                                            },
                                            '& input': {
                                                color: !editMode ? 'black' : 'black', 
                                                cursor: !editMode ? 'default' : 'text', 
                                                padding: !editMode ? '0.5rem 0' : '0.5rem', 
                                            },
                                        }}
                                    />
                                        <Typography fontSize={'0.8rem'}>{activeWorkoutData.exercises?.length || 0} Exercises</Typography>
                                    </Box>
                                    <Box>
                                        <Button 
                                            disabled= {!(activeWorkoutData.exercises?.length || editMode) | isDisabled}
                                            sx={{
                                                backgroundColor: editMode ? '#c93049' : '#57c90c',
                                                // color: editMode ? theme => theme.palette.primary.main : 'white'
                        
                                            }} 
                                            onClick={handleCardButton} 
                                            variant='contained'
                                            >
                                            {editMode ? 'Delete' : (workoutMode ? 'Done' : 'Start')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Box padding='0 1rem'>
                                <TextField 
                                    fullWidth 
                                    // label="Description" 
                                    name='description' 
                                    multiline 
                                    label='Description'
                                    value={workoutDetailForm.description}
                                    onChange={handleOnChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        readOnly: !editMode,
                                    }}
                                    variant= {editMode ? "outlined" : "filled"}
                                    sx={editMode ? {
                                        '& .MuiOutlinedInput-root': {
                                            // Styles for the root of the outlined input
                                            '& fieldset': {
                                                borderColor: editMode ? 'grey' : 'transparent', // Adjust border color based on edit mode
                                            },
                                            '&:hover fieldset': {
                                                borderColor: editMode ? 'grey' : 'transparent', // Adjust border color on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: editMode ? 'grey' : 'transparent', // Adjust border color when focused
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            // Styles for the input label
                                            color: editMode ? 'black' : 'grey', 
                                        },
                                        '& input': {
                                            color: !editMode ? 'black' : 'black', 
                                            cursor: !editMode ? 'default' : 'text', 
                                            padding: !editMode ? '0.5rem 0' : '0.5rem', 
                                        },
                                    }: 
                                    {
                                        '& .MuiFilledInput-root': {
                                            '&:before': {
                                            borderBottom: 'none', 
                                            },
                                            '&:after': {
                                            borderBottom: 'none',
                                            },
                                            '&:hover:not(.Mui-disabled):before': {
                                            borderBottom: 'none', 
                                            },
                                            '&.Mui-focused:after': {
                                            borderBottom: 'none', 
                                            },
                                        },
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f5f5f5', 
                                        },
                                        }
                                    }

                                    /> 
                            </Box>
                    
    
                        </CardContent>
                    </Card>
                    {editMode && <Button fullWidth  variant='contained' onClick={handleOpenAddExercise}>+ Add Exercise</Button>}
                    


        
                    <Box 
                        gap={'0.5rem'} 
                        width='100%' 
                        flexDirection='column' 
                        justifyContent="center"
                        alignItems="center"
                        display='flex'
                        // border={`0.5px solid #D8D8D8`}

                        >
                    
                        {   
                            workoutDetailForm.exercises?.length > 0 ? 
                            workoutDetailForm.exercises.map((exercise)=>{
                                return <ExerciseCard key={exercise.id} exercise={exercise} handleExerciseChange={handleExerciseChange}/>
                            }):(
                                <Card
                                sx={{
                                    width:'90%',
                                    border:`0.5px solid #D8D8D8`,
                                    boxShadow: 'none',
                                    borderRadius:'10px',
                                    margin:'auto'
                                }}>
                                <CardContent >
                                    <Box sx={{ display: 'flex', flexDirection:'column', alignItems: 'center', marginTop: '1rem'}}>
                                        {
                                            editMode ? <Typography color={"#b8b8b8"}>No exercises added yet for this workout</Typography> :
                                            <Typography color={"#b8b8b8"}>Edit workout to add exercises</Typography>
                                        }
                                    </Box>
                                </CardContent>
                            </Card> 
                            )
                        }
                
                    </Box> 

                
            
                </Box>
                <Box
                        sx={{
                        backgroundColor:'background.paper',
                        // opacity:'90%',
                        position: 'fixed',
                        bottom: '0%',
                        left: '0%',
                        width: '100%',
                        margin: 0,
                        padding: '1% 10%',
                        boxSizing: 'border-box',
                        zIndex: 1000,
                    }}
                >
                    <Box width='100%' display='flex' sx={{alignItems:'center', justifyContent:'center'}}>
                        <Box width="50vw" >
                            <Button 
                                type={editMode ? 'submit' : 'button'} 
                                fullWidth
                                disabled ={(workoutMode && true) | isDisabled} 
                                onClick={handleBottomButton} 
                                variant={editMode ? 'contained' : 'outlined'} 
                                >
                                {editMode ? 'Save' : 'Back'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </form>
        </Container>
    );
}

export default WorkoutDetailPage;
