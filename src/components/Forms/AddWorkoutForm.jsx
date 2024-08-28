import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid} from '@mui/material';
import { useWorkoutContext } from '../../Contexts/WorkoutContext';


const AddWorkoutForm = ({ onClose}) => {
  const {addWorkout} = useWorkoutContext();

  const [formData, setFormData] = useState({
    workout_id: null,
    workout_name: '',
    description: '',
    tags: [],
    last_completed:null,
    created_on: new Date(Date.now()*1000).toISOString(),
    frequency:'',
    exercises:[]
 
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFormData = {
      ...formData,
    };
    addWorkout(newFormData);
    onClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          Create a Workout
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0.5, mb: 0.5 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ mt: 0.2, mb: 0.2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="workout_name"
              label="Workout Name"
              name="workout_name"
              value={formData.workout_name}
              onChange={handleChange}
              autoComplete="workout_name"
              sx={{ mt: 0.2, mb: 0.2, fontSize: '1rem' }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 0.2, mb: 0.2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              autoComplete="goalDescription"
              multiline
              rows={4}
              sx={{ mt: 0.2, mb: 0.2, fontSize: '1rem' }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ mr: 1 }}
          >
            + Add Workout
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ ml: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddWorkoutForm;
