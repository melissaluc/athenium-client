import { useState, useEffect } from 'react';
import {Box, Button, Modal, CircularProgress, Divider, Stack, Chip} from '@mui/material';
import { useWorkoutContext } from '../../Contexts/WorkoutContext';
import exercisesData from "../../data/exercises.json"
import { maxHeight } from '@mui/system';
import { TextField, Typography } from '@mui/material';
import { IconButton } from 'rsuite';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight:'80vh',
  overflow:'hidden'

};

function ExerciseModal({workoutDetailForm, handleClose, open}) {
    const {addExercise, updateWorkoutDetails} = useWorkoutContext();
    const [fullExercises] = useState(exercisesData)
    const [activeView, setActiveView] = useState('strength_training')
    const [exercises,setExercises] = useState(exercisesData)

    const handleView = (category)=> {
        setActiveView(category)
    }

    useEffect(()=>{
        setExercises(fullExercises)
    },[activeView])
    
    const handleOnClickSelectExercise = (exercise) =>{
        console.log(exercise)
        addExercise(exercise)
        updateWorkoutDetails(workoutDetailForm)
        
        handleClose()
    }

    return (
    <Box>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', justifyContent:'center',}}>
                <Box sx={{position:'sticky', top:'0px', backgroundColor: 'background.paper', paddingBottom:'0.5rem'}} >
                    <Stack direction='row' justifyContent={'space-between'}>
                        <Typography variant='subtitle1' fontWeight={'bold'} color='primary'>SELECT AN EXERCISE</Typography>
                        {/* <IconButton variant='' onClick={handleClose} ><CloseIcon/></IconButton> */}
                        <Button variant='text' onClick={handleClose} >close</Button>
                    </Stack>
                    <Stack  
                        direction="row"
                        justifyContent="space-evenly"
                        alignItems="center"
                        useFlexGap 
                        gap='0.5rem'
                        paddingBottom='1rem'
                        flexWrap="wrap">
                        {Object.keys(fullExercises).map((category)=>{
                            return(
                                <Chip clickable key={category} size='large' onClick={()=>{handleView(category)}} label={category.replace(/_/g, " ")}/>
                            )
                        })}
                    </Stack>
                <Divider/>
                </Box>
                <Box 
                        m='1rem' 
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        width='100%'
                        maxHeight='calc(50vh - 2rem)' // Adjust height to fit within the modal
                        overflow='auto'
                        sx={{
                            border: '1px solid #ddd',
                            padding: '1rem',
                            boxSizing: 'border-box', // Ensures padding and border are included in the total width and height
                        }}
                    >
                    {exercises !== null ? Object.entries(exercises).map(([group, value])=>{
                        return (
                            <Box key={group} width='100%' >
                                <Divider><Typography variant='subtitle1' fontWeight={'bold'}>{group.toUpperCase()}</Typography></Divider>
                                {value && value.map((item)=>{ 
                                    const {exerciseName, imgURL} = item
                                    return(
                                            <Box sx={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:'2rem', cursor:'pointer'}} onClick={()=>handleOnClickSelectExercise(({exerciseName, group, imgURL}))}>
                                                    <Box><img src={imgURL} alt={exerciseName}></img></Box>
                                                    <Typography >{exerciseName}</Typography>
                                            </Box>
    
                                        )
                                })}
                            </Box>
                        
                        )})
           
                    :<CircularProgress />}
                </Box>
            </Box>
        </Box>
        </Modal>
    </Box>
    );
}

export default ExerciseModal;