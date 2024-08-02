import { Box, Typography, Grid, IconButton, Button ,TextField } from "@mui/material";
import { useState, useEffect } from "react";
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../../utils/axiosConfig'
import ResultsModal from "../../Modals/ResultsModal";

function ListItemExerciseCard({ userData, data, editMode, handleClickAddExercise, handleClickDeleteExercise, handleExerciseChanges, setUpdatedExercises }) {
    const [formData, setFormData] = useState({...data, age: userData.age, body_weight: userData.weight, body_mass_uom: userData.uom.body_mass.uom , lift_uom:userData.uom.lift_weight.uom});
    const [open, setOpen] = useState(false)
    const [results, setResults] = useState(null)
    const [error, setError] = useState(null);


    useEffect(() => {
        handleExerciseChanges(formData);
        console.log('form data ',formData)
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Check if 'name' corresponds to fields that should be parsed as floats
        if (name === 'weight' || name === 'reps' || name === 'distance' || name === 'duration' || name === 'sets') {
            // Parse value to float, ensuring to handle cases where value is empty or non-numeric
            const floatValue = parseFloat(value.trim()); // trim() removes leading and trailing whitespace
    
            // Check if the parsed float value is NaN (Not a Number)
            const formattedValue = isNaN(floatValue) ? '' : floatValue;
    
            // Update state using the formatted float value
            setUpdatedExercises(prev => {
                // Find the index of the updated exercise
                const index = prev.findIndex(exercise => exercise.uid === formData.id);

                let updatedExercises = [...prev];
                if (index !== -1) {
                    updatedExercises[index] = {
                        ...updatedExercises[index],
                        [name]: name === 'sets' ? parseInt(formattedValue) : formattedValue // Update the specific field
                    };
                } else {
                    updatedExercises = [
                        ...prev,
                        {
                            [name]: formattedValue,
                            uid: data.id
                        }
                    ]
                }
        
                return updatedExercises;
            });
    
            setFormData(prev => ({
                ...prev,
                uid: data.id,
                [name]: formattedValue
            }));
        } else {
            // For fields that shouldn't be parsed as floats, update state directly
            setUpdatedExercises(prev => [
                ...prev,
                {
                    [name]: value,
                    uid: data.id
                }
            ]);
    
            setFormData(prev => ({
                ...prev,
                uid: data.id,
                [name]: value
            }));
        }
    };
    

    const handleCalcStengthLevel = (data)=>{
        setOpen(true)
        setError(null);
        axiosInstance.post(`/strength`, data)
        .then(response => {
                console.log('results: ',response.data[0])
                setResults(response.data[0])
                setError(null);
            })
            .catch(error=>{
                console.error(error)
                setError(error)
            })
    }

    const renderStrengthFields = () => (
        <>
            <Grid item xs={1}>
                <TextField name='weight' value={formData.weight} label="Lift Weight" variant="outlined" size="small" onChange={handleChange} />
            </Grid>
            <Grid item xs={1}>
                <TextField name='reps' value={formData.reps} label="Reps" variant="outlined" size="small" onChange={handleChange} />
            </Grid>
            <Grid item xs={1}>
                <TextField name='sets' value={formData.sets} label="Sets" variant="outlined" size="small" onChange={handleChange} />
            </Grid>
        </>
    );

    const renderCardioFields = () => (
        <>
            <Grid item xs={1}>
                <TextField name='distance' value={formData.distance} label="Distance" variant="outlined" size="small" onChange={handleChange} />
            </Grid>
            <Grid item xs={1}>
                <TextField name='duration' value={formData.duration} label="Duration" variant="outlined" size="small" onChange={handleChange} />
            </Grid>
            <Grid item xs={1}>
                <TextField name='sets' value={formData.sets} label="Sets" variant="outlined" size="small" onChange={handleChange} />
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
            <Grid item xs={1}>
                <IconButton color="primary" onClick={() => handleCalcStengthLevel(formData)}><CalculateIcon/></IconButton>
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
            <Grid item xs={1}>
                <IconButton onClick={() => handleCalcStengthLevel(formData)}><CalculateIcon/></IconButton>
            </Grid>
        </>
    );

    return (
        <>
        <ResultsModal open={open} handleClose={setOpen} results={results} error={error}/>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
                <Box sx={{ width: '4rem', height: '4rem', border: 'solid 1px gray', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {data.img_url && <img src={data.img_url}></img>}
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
                        <Button onClick={() => handleClickDeleteExercise(data)}><DeleteIcon></DeleteIcon></Button>
                    </Grid>
                </>
            ) : (
                formData.category === 'strength' ? renderStrengthDisplay() : renderCardioDisplay()
            )}
        </Grid>
        </>
    );
}

export default ListItemExerciseCard;
