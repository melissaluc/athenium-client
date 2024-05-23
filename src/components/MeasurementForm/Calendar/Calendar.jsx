import React, { useState, useEffect, useRef  } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css'; // You can choose a theme
import { Box, Typography } from '@mui/material';


function MyDatePicker(props) {
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date
  const inputRef = useRef(null);

  
  
  useEffect(() => {
    fetchDataForDate(selectedDate); // Fetch data for the initial selected date
  }, [selectedDate]); // Run this effect only once after the component mounts
  
  // TODO: replace with useEffect and interact with backend to retrieve PoM data queried by date
  const fetchDataForDate = (date) => {
    // Here you can fetch data for the selected date from your API or any other data source
    console.log('Fetching data for date:', date);
    
  };
  
  const handleDateSelect = (selectedDates) => {
    const selectedDate = selectedDates[0]; // Get the selected date
    setSelectedDate(selectedDate); // Update the state with the selected date
    if(props.setParentSelectDate){
      props.setParentSelectDate(selectedDate)
    }
  };

  const handleInputFocus = () => {
    if (selectedDate) {
      inputRef.current.flatpickr.open(); // Open the Flatpickr calendar when the input is focused
    }
  };


  return (
    <Box sx={{
      display:'flex', 
      // flexDirection:'column',
      justifyContent:'space-between',
      alignItems:'center',
      marginTop:"0rem",
      paddingTop:"0rem",
      
      }}>
    {/* Display data related to the selected date */}
    {selectedDate && <Typography>{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Typography>}
      <Flatpickr
      ref = {inputRef}
        options={{
          dateFormat: 'F j, Y', // Set the date format
          defaultDate: selectedDate, // Set the default date to the initial selected date
          onClose: handleDateSelect,
        }}
        onChange={()=>{}}
        onClose={() => {}}
        onFocus={handleInputFocus}
      />
    </Box>
  );
}

export default MyDatePicker;
