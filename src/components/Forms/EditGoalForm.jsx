import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, Autocomplete } from '@mui/material';

const EditGoalForm = ({ onClose, data, handleEditGoal }) => {
  const [formData, setFormData] = useState({
    id:'',
    name: '',
    description: '',
    category: '',
    metric: '',
    unit: '',
    start_value: '',
    target_value: '',
  });

  const formOptions = {
    category: ['mobility', 'strength progression', 'change body composition'],
    metric: ['runtime', 'lift', 'weight'],
    unit: ['km', 'lbs'],
  };

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        category: formOptions.category.includes(data.category) ? data.category : data.category,
        metric: formOptions.metric.includes(data.metric) ? data.metric : data.metric,
        unit: formOptions.unit.includes(data.unit) ? data.unit : data.unit,
      });
    }
  }, [data]);

  const handleDropdownChange = (e, value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e, value, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("EditForm ",formData)
    handleEditGoal(formData);
    onClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} gutterBottom>
          <Typography variant="h4">
            Edit Goal
          </Typography>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ ml: 1, height: '2rem' }}
          >
            Delete
          </Button>
        </Box>
        <Box>
          <Button>Edit Start Date</Button>
          <Typography>{(new Date(formData.start_date * 1000).toLocaleDateString())}</Typography>
        </Box>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 0.5, mb: 0.5 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ mt: 0.2, mb: 0.2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Goal Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
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
              autoComplete="description"
              multiline
              rows={4}
              sx={{ mt: 0.2, mb: 0.2, fontSize: '1rem' }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 0, mb: 0.2 }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={formOptions.category}
              value={formData.category}
              onChange={(e, value) => handleDropdownChange(e, value, 'category')}
              onInputChange={(e, value) => handleInputChange(e, value, 'category')}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 0.2, mb: 0.2 }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={formOptions.metric}
              value={formData.metric}
              onChange={(e, value) => handleDropdownChange(e, value, 'metric')}
              onInputChange={(e, value) => handleInputChange(e, value, 'metric')}
              renderInput={(params) => <TextField {...params} label="Metric" />}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 0.2, mb: 0.2 }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={formOptions.unit}
              value={formData.unit}
              onChange={(e, value) => handleDropdownChange(e, value, 'unit')}
              onInputChange={(e, value) => handleInputChange(e, value, 'unit')}
              renderInput={(params) => <TextField {...params} label="Unit" />}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 0.2, mb: 0.2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="start_value"
              label="Start Value"
              name="start_value"
              value={formData.start_value}
              onChange={handleChange}
              sx={{ mt: 0.2, mb: 0.2, fontSize: '1rem' }}
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 0.2, mb: 0.2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="target_value"
              label="Target Value"
              name="target_value"
              value={formData.target_value}
              onChange={handleChange}
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
            Save
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

export default EditGoalForm;
