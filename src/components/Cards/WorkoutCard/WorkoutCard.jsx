import { Box, Typography, Button, Card, CardActionArea, CardActions
    ,CardContent, 
    TextField} from "@mui/material"; 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExerciseModal from "../../Modals/ExerciseModal";


import ListItemExerciseCard from "./ListItemExerciseCard";

import { useState } from "react";
import { useTheme } from "@emotion/react";


function WorkoutCard ({data, handleAddTag, handleAddExercise, handleDeleteExercise, handleUpdateData, handleDeleteWorkout }) {
    const [expandWorkout, setExpandWorkout] = useState(false)
    const [editMode, setEditMode]=useState(false)
    const [formData, setFormData] = useState({
                                                description:data.description, 
                                                workout_name:data.workout_name,
                                                exercises:data.exercises
                                            })
  
    // Open & close Exercise Modal
    const [open, setOpen] = useState(false);
    const theme = useTheme()
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    

    const date = new Date(data.last_completed*1000);
    const convertedDate = date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });

    

    const handleClickAddExercise = ()=>{
        handleOpen()
        console.log(open);
    }
    const handleClickEdit = ()=>{
        setEditMode(true)
        console.log(editMode)
        setExpandWorkout(true)
    }

    const handleCancel = ()=>{
        setEditMode(false)
    }

    const handleChange = (e) =>{
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleExerciseChanges = (data) =>{
        setFormData((prevData) => ({
            ...prevData,
            exercises: data,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateData(formData)
      };

    return(
        <Card>
        <CardContent component="form" onSubmit={handleSubmit} noValidate>
            <Box >
                <Typography fontSize='0.7rem'>Last completed on {convertedDate}</Typography>
                <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    {editMode?(<Box sx={{display:'flex', alignItems:'center', gap:'1rem'}}>
                        <TextField name='workout_name' value={formData.workout_name} onChange={handleChange}></TextField> 
                        <Button onClick={()=>handleDeleteWorkout(data.workout_id)}>Delete</Button>
                    </Box>):
                    <Typography>{data.workout_name}</Typography>}
                    {editMode? (
                        <Button type="submit" onClick={()=>{setEditMode(false)}}>Save</Button> 
                           ) : (
                        <Button onClick={handleClickEdit}>Edit</Button> 
                    )}
                </Box>
                <Box>
                    {editMode?
                        (<Box sx={{display:'flex', gap:'0.5rem', flexWrap:'wrap', alignItems:'center'}}>
                        {data.tags.map((tag)=>{
                            return(
                                <Typography key={tag} fontSize='0.7rem' sx={{backgroundColor:'black', color:'white', p:'0.2rem'}}>{tag.toUpperCase()}</Typography>
                            )
                        })} 
                        <Button onClick={handleAddTag}>Add tag</Button>
                        </Box>
            
                        ):
                        (!data.tags.length ? (
                            <Typography fontSize='0.7rem'>No Tags</Typography> 
                            ): (
                            <Box sx={{display:'flex', gap:'0.5rem', flexWrap:'wrap', alignItems:'center'}}>
                            {data.tags.map((tag)=>{
                                return(
                                    <Typography key={tag} fontSize='0.7rem' sx={{backgroundColor:'black', color:'white', p:'0.2rem'}}>{tag.toUpperCase()}</Typography>
                                )
                            })} 
                        </Box>))}
                </Box>
    
            </Box>
            {expandWorkout && 
            <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                {editMode? 
                <TextField name='description' multiline value={formData.description} onChange={handleChange}></TextField>:
                <Typography variant="body">
                    {data.description}
                </Typography>

                }
                <Box sx={{display:'flex', alignItems:'center', flexDirection:'column', gap:'1rem', borderTop:'1px black solid', pt:"1rem"}}>
                    {data.exercises.length ? data.exercises.map((item)=>{
                        return <ListItemExerciseCard 
                                key={item.id} 
                                data={{...item, workout_id: data.workout_id}}
                                editMode={editMode} 
                                handleClickAddExercise={handleClickAddExercise} 
                                handleDeleteExercise={handleDeleteExercise}
                                handleExerciseChanges={handleExerciseChanges}/>
                    }): <Typography fontSize='0.7rem'>No Exercises</Typography>
                }
                {editMode  &&
                <>
                    <Box sx={{display:'flex', justifyContent:'center', flexDirection:'column', gap:'1rem'}}>
                        <Button onClick={handleClickAddExercise}>+ Add Exercise</Button>
                        <Button onClick={handleCancel}>Cancel</Button> 
                    </Box>
                    <ExerciseModal workout_id={data.workout_id} handleClose={handleClose} open={open} handleAddExercise={handleAddExercise}/>
                </>

                }
                    
                </Box>

            </Box>}
        </CardContent>
        <CardActionArea sx={{
            width:'100%', 
            margin:'0px', 
            padding:'0px', 
            backgroundColor:theme.palette.secondary.main, 
            opacity:"40%",
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