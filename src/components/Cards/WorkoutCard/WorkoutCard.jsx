import { Box, Typography, Button, Card, CardActionArea, CardActions, CardContent, TextField } from "@mui/material"; 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExerciseModal from "../../Modals/ExerciseModal";
import ListItemExerciseCard from "./ListItemExerciseCard";
import { useState } from "react";
import { useTheme } from "@emotion/react";

function WorkoutCard({ data, handleAddTag, handleAddExercise, handleDeleteExercise, handleUpdateData, handleDeleteWorkout }) {
    const [expandWorkout, setExpandWorkout] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState(data);
    const [originalData, setOriginalData] = useState(data);

    // Open & close Add Exercise Modal
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleClickAddExercise = () => {
        handleOpen();
        console.log("Add Exercise Modal: ", open);
    };

    const handleClickEdit = (e) => {
        e.preventDefault();
        setEditMode(true);
        console.log("Edit mode: ", editMode);
        setExpandWorkout(true);
    };

    const handleCancel = () => {
        setFormData(originalData);
        setEditMode(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        handleDeleteExercise(formData.workout_id, selectedExercise);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateData(formData);
        // Update original data to the new saved state
        setOriginalData(formData); 
        console.log('submitted data ', formData);
        setEditMode(false);
    };

    return (
        <Card>
            <CardContent component="form" onSubmit={handleSubmit} noValidate>
                <Box>
                    <Typography fontSize='0.7rem'>Last completed on {new Date(data.last_completed * 1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</Typography>
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
                                    <Typography key={tag} fontSize='0.7rem' sx={{ backgroundColor: 'black', color: 'white', p: '0.2rem' }}>{tag.toUpperCase()}</Typography>
                                ))}
                                <Button onClick={handleAddTag}>Add tag</Button>
                            </Box>
                        ) : (
                            !formData.tags.length ? (
                                <Typography fontSize='0.7rem'>No Tags</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {formData.tags.map((tag) => (
                                        <Typography key={tag} fontSize='0.7rem' sx={{ backgroundColor: 'black', color: 'white', p: '0.2rem' }}>{tag.toUpperCase()}</Typography>
                                    ))}
                                </Box>
                            )
                        )}
                    </Box>
                </Box>
                {expandWorkout &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: "1rem" }}>
                        {editMode ?
                            <TextField name='description' multiline value={formData.description} onChange={handleChange} /> :
                            <Typography variant="body">
                                {formData.description}
                            </Typography>
                        }
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '1rem', borderTop: '1px black solid', pt: "1rem" }}>
                            {formData.exercises.length ? formData.exercises.map((item) => (
                                <ListItemExerciseCard
                                    key={item.id}
                                    data={item}
                                    editMode={editMode}
                                    handleClickAddExercise={handleClickAddExercise}
                                    handleClickDeleteExercise={handleClickDeleteExercise}
                                    handleExerciseChanges={(updatedExercise) => {
                                        const updatedExercises = formData.exercises.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex);
                                        handleExerciseChanges(updatedExercises);
                                    }}
                                />
                            )) : <Typography fontSize='0.7rem'>No Exercises</Typography>
                            }
                            {editMode &&
                                <>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                                        <Button onClick={handleClickAddExercise}>+ Add Exercise</Button>
                                        <Button onClick={handleCancel}>Cancel</Button>
                                    </Box>
                                    <ExerciseModal workout_id={data.workout_id} handleClose={handleClose} open={open} handleAddExercise={handleAddExercise} />
                                </>
                            }
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
                    <Button onClick={() => { setExpandWorkout(prev => !prev) }} sx={{ width: '100%', margin: '0px', padding: '0px' }}><ArrowDropDownIcon sx={{ transform: expandWorkout ? 'scaleY(-1)' : 'none' }} /></Button>
                </CardActions>
            </CardActionArea>
        </Card>
    );
}

export default WorkoutCard;
