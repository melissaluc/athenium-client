import { Box, Typography, Grid, Button, TextField } from "@mui/material";
import { useState } from "react";


function ListItemExerciseCard({ workout_id, data, editMode, handleClickAddExercise, handleDeleteExercise, handleExerciseChanges}) {


    const [formData, setFormData] = useState({...workout_id,...data});

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
        handleExerciseChanges(formData)
      };


    const renderStrengthFields = () => (
        <>
            <Grid item xs={1}>
                <TextField name='weight' value={formData.weight} label="Lift Weight" variant="outlined" size="small" onChange={handleChange}/>
            </Grid>
            <Grid item xs={1}>
                <TextField name='reps' value={formData.reps} label="Reps" variant="outlined" size="small" onChange={handleChange}/>
            </Grid>
            <Grid item xs={1}>
                <TextField name='sets' value={formData.sets} label="Sets" variant="outlined" size="small" onChange={handleChange}/>
            </Grid>
        </>
    );

    const renderCardioFields = () => (
        <>
            <Grid item xs={1}>
                <TextField name='distance' value={formData.distance} label="Distance" variant="outlined" size="small" onChange={handleChange}/>
            </Grid>
            <Grid item xs={1}>
                <TextField name='duration' value={formData.duration} label="Duration" variant="outlined" size="small" onChange={handleChange}/>
            </Grid>
            <Grid item xs={1}>
                <TextField name='sets' value={formData.sets} label="Sets" variant="outlined" size="small" onChange={handleChange}/>
            </Grid>
        </>
    );

    const renderStrengthDisplay = () => (
        <>
            <Grid item xs={2}>
                <Typography>Lift Weight</Typography>
                <Typography>{formData.weight}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography>Reps</Typography>
                <Typography>{formData.reps}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography>Sets</Typography>
                <Typography>{formData.sets}</Typography>
            </Grid>
        </>
    );

    const renderCardioDisplay = () => (
        <>
            <Grid item xs={2}>
                <Typography>Distance</Typography>
                <Typography>{formData.distance || "-"}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography>Duration</Typography>
                <Typography>{formData.duration || "-"}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography>Sets</Typography>
                <Typography>{formData.sets || "-"}</Typography>
            </Grid>
        </>
    );

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
                <Box sx={{ width: '4rem', height: '4rem', backgroundColor: 'gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Img
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    {formData.group ? formData.group.toUpperCase() : formData.category.toUpperCase()}
                </Typography>
                {editMode ? (
                    <Button onClick={handleClickAddExercise}>
                        <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{formData.exercise_name}</Typography>
                    </Button>
                ) : (
                    <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                        {formData.exercise_name.toUpperCase()}
                    </Typography>
                )}
            </Grid>
            {editMode ? (
                <>
                    {formData.category === 'strength' ? renderStrengthFields() : renderCardioFields()}
                    <Grid item xs={1}>
                        <Button onClick={() => handleDeleteExercise({ workout_id, ...data })}>X</Button>
                    </Grid>
                </>
            ) : (
                formData.category === 'strength' ? renderStrengthDisplay() : renderCardioDisplay()
            )}
        </Grid>
    );
}

export default ListItemExerciseCard;
