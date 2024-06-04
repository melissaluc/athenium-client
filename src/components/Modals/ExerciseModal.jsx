import { useState, useEffect } from 'react';
import {Box, Button, Modal, CircularProgress} from '@mui/material';

import exercisesData from "../../data/exercises.json"
import { maxHeight } from '@mui/system';
import { TextField, Typography } from '@mui/material';

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
  overflow:'auto'

};

function ExerciseModal({workout_id, handleClose, open, handleAddExercise}) {
    const [fullExercises] = useState(exercisesData)
    const [activeView, setActiveView] = useState('strength_training')
    const [exercises,setExercises] = useState(exercisesData['strength_training'])

    const handleView = (category)=> {
        setActiveView(category)
    }

    useEffect(()=>{
        setExercises(fullExercises[activeView])

    },[activeView])

    const handleOnClickSelectExercise = (exercise) =>{
        console.log(exercise)
        handleAddExercise(exercise)
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
            <Box sx={{display:'flex', flexDirection:'column'}}>
                <Typography>Select an Exercise</Typography>
                <Box sx={{display:'flex', justifyContent:'flex-start', gap:'1rem', margin:'1rem 0', flexWrap:'wrap'}}>
                    {Object.keys(fullExercises).map((category)=>{
                        return(
                            <Button key={category} variant="outlined" onClick={()=>{handleView(category)}}>{category.replace(/_/g, " ")}</Button>
                        )
                    })}
                </Box>
                <Box >
                    {exercises !== null ? Object.entries(exercises).map(([group, value])=>{
                        return (
                            <Box key={group} sx={{borderTop:'1px solid black', p:'1.5rem 0'}}>
                                <Typography variant='h6'>{group.toUpperCase()}</Typography>
        
                                {value && value.map((exercise_name)=>{ 
                                    return(
                                        <Box sx={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:'2rem'}}>
                                            <Box>img</Box>
                                            <Button onClick={()=>handleOnClickSelectExercise(({workout_id, exercise_name, group}))}>{exercise_name}</Button>
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