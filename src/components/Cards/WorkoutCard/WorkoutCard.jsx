import { Box, Typography, Button, Card, CardActionArea, CardActions, CardContent, TextField } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExerciseModal from "../../Modals/ExerciseModal";
import ListItemExerciseCard from "./ListItemExerciseCard";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import axios from 'axios'

function WorkoutCard({ 
                        data, 
                        handleAddTag, 
                        handleAddExercise, 
                        handleDeleteExercise, 
                        handleUpdateData, 
                        handleDeleteWorkout,  
                        addedExercises, 
                        setAddedExercises,
                        deletedExercises, 
                        setDeletedExercises,
                        updatedExercises, 
                        setUpdatedExercises }) {

    const [expandWorkout, setExpandWorkout] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(data);
    const [originalData, setOriginalData] = useState(data);
    const [open, setOpen] = useState(false);
    const [updateWorkoutDetails, setUpdateWorkoutDetails] = useState({})
    const theme = useTheme();

    useEffect(() => {
        setFormData(data);
        setOriginalData(data);
    }, [data]);
    

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClickAddExercise = () => {
        handleOpen();
    };

    const handleClickEdit = (e) => {
        e.preventDefault()
        setEditMode(true);
        setExpandWorkout(true); // Expand workout panel on edit
    };

    const handleCancel = () => {
        setFormData(originalData); // Reset form data to original
        setEditMode(false);
        setDeletedExercises([])
        setAddedExercises([])
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateWorkoutDetails(prev=>({...prev, [name]: value}))
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleExerciseChanges = (updatedExercises) => {
        setFormData((prevData) => ({
            ...prevData,
            exercises: updatedExercises,
        }));
    };
    
    const handleClickDeleteExercise = (selectedExercise) => {
        const updatedExercises = formData.exercises.filter(exercise => exercise.id !== selectedExercise.id);
        handleExerciseChanges(updatedExercises);
        handleDeleteExercise(selectedExercise); // Only pass exercise id or data needed for deletion
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateData(formData);
        setOriginalData(formData); // Update original data after save
        setEditMode(false);
        // Update exercises and workout details
        if(deletedExercises || addedExercises || updatedExercises || updateWorkoutDetails){
            const patchData = {
                updatedWorkoutDetails: updateWorkoutDetails? updateWorkoutDetails : {},
                addedExercises: addedExercises ? addedExercises : [],
                deletedExercises: deletedExercises ? deletedExercises : [],
                updatedExercises: updatedExercises ? updatedExercises : [],
            }
            console.log(patchData)
            
            axios.patch(`http://localhost:5000/api/v1/workouts/39b17fed-61d6-492a-b528-4507290d5423/${data.workout_id}`,patchData)
            .then(response =>{
                console.log(response)
                setDeletedExercises([])
                setAddedExercises([])
                setUpdatedExercises([])
                setUpdateWorkoutDetails({})
            })
            .catch(error=>console.error(error))
        }
    };

    return (
        <Card>
            <CardContent component="form" onSubmit={handleSubmit} noValidate>
                <Box>
                    {/* TODO: update conversion of last_completed */}
                    <Typography>{data.last_completed && `Last completed on  ${new Date(data.last_completed).toLocaleDateString()}`}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        {editMode ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <TextField name='workout_name' value={formData.workout_name} onChange={handleChange} />
                                <Button onClick={() => handleDeleteWorkout(data.workout_id)}>Delete</Button>
                            </Box>
                        ) : (
                            <Typography>{formData.workout_name}</Typography>
                        )}
                        {editMode ? (
                            <Button type="submit">Save</Button>
                        ) : (
                            <Button onClick={handleClickEdit}>Edit</Button>
                        )}
                    </Box>
                    <Box>
                        {editMode ? (
                            <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {formData.tags.map((tag) => (
                                    <Typography key={tag} sx={{ backgroundColor: 'black', color: 'white', p: '0.2rem' }}>{tag.toUpperCase()}</Typography>
                                ))}
                                <Button onClick={handleAddTag}>Add tag</Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {formData.tags.length ? formData.tags.map((tag) => (
                                    <Typography key={tag} sx={{ backgroundColor: 'black', color: 'white', p: '0.2rem' }}>{tag.toUpperCase()}</Typography>
                                )) : (
                                    <Typography>No Tags</Typography>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
                {expandWorkout &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1rem" }}>
                        {editMode ? (
                            <TextField name='description' multiline value={formData.description} onChange={handleChange} />
                        ) : (
                            <Typography variant="body">{formData.description}</Typography>
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px black solid', pt: "1rem" }}>
                            {formData.exercises.length ? formData.exercises.map((exercise) => (
                                <ListItemExerciseCard
                                    key={exercise.id}
                                    data={exercise}
                                    editMode={editMode}
                                    setUpdatedExercises={setUpdatedExercises}
                                    handleClickDeleteExercise={handleClickDeleteExercise}
                                    handleExerciseChanges={(updatedExercise) => {
                                        const updatedExercises = formData.exercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex);
                                        handleExerciseChanges(updatedExercises);
                                    }}
                                />
                            )) : (
                                <Typography>No Exercises</Typography>
                            )}
                            {editMode && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                                    <Button onClick={handleClickAddExercise}>+ Add Exercise</Button>
                                    <Button onClick={handleCancel}>Cancel</Button>
                                </Box>
                            )}
                            <ExerciseModal workout_id={data.workout_id} handleClose={handleClose} open={open} handleAddExercise={handleAddExercise} />
                        </Box>
                    </Box>
                }
            </CardContent>
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
        </Card>
    );
}

export default WorkoutCard;
