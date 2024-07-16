import { Button, Typography, Container, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import MeasurementForm from '../components/MeasurementForm/MeasurementForm';
import MeasurementModal from '../components/MeasurementModal';
import axios from 'axios';
import {findClosestData} from '../utils/utils'

function MeasurementPage() {
    const [waistHipRatio, setWaistHipRatio] = useState(null);
    const [data, setData] = useState([]);
    const [inputValues, setInputValues] = useState({
        dateSelected: new Date().setHours(0, 0, 0, 0) / 1000,
        left: {
            Neck: 0,
            Chest: 0,
            Abdomen: 0,
            'L-Bicep': 0,
            'L-Upper Thigh': 0,
            'L-Thigh': 0,
            'L-Calf': 0,
        },
        right: {
            Shoulder: 0,
            Waist: 0,
            Hip: 0,
            'R-Bicep': 0,
            'R-Upper Thigh': 0,
            'R-Thigh': 0,
            'R-Calf': 0,
        },
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/measurements/39b17fed-61d6-492a-b528-4507290d5423')
            .then(response => {
                setData(response.data);  // Make sure response.data is correctly set
                const currentTime = new Date().getTime();
                handleSelectDate(currentTime);  // Ensure handleSelectDate is called correctly
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    

    

    const handleSelectDate = (selectedDate) => {
        const selectedData = findClosestData(selectedDate, data);
        if (selectedData) {
            const newData = {
                dateSelected: selectedDate,
                left: {
                    ...inputValues.left,
                    Neck: selectedData.neck_cm || 0,
                    Chest: selectedData.chest_cm || 0,
                    Abdomen: selectedData.abdomen_cm || 0,
                    'L-Bicep': selectedData.l_bicep_cm || 0,
                    'L-Upper Thigh': selectedData.l_upper_thigh_cm || 0,
                    'L-Thigh': selectedData.l_thigh_cm || 0,
                    'L-Calf': selectedData.l_calf_cm || 0,
                },
                right: {
                    ...inputValues.right,
                    Shoulder: selectedData.shoulder_cm || 0,
                    Waist: selectedData.waist_cm || 0,
                    Hip: selectedData.hip_cm || 0,
                    'R-Bicep': selectedData.r_bicep_cm || 0,
                    'R-Upper Thigh': selectedData.r_upper_thigh_cm || 0,
                    'R-Thigh': selectedData.r_thigh_cm || 0,
                    'R-Calf': selectedData.r_calf_cm || 0,
                },
            };
            setInputValues(newData);
            console.log('new inputvalues', inputValues);
        }
    };

    const handleInputChange = (side, label, value) => {
        setInputValues(prevState => ({
            ...prevState,
            [side]: {
                ...prevState[side],
                [label]: value || 0,
            },
        }));
    };

    useEffect(() => {
        setWaistHipRatio((inputValues.right.Waist / inputValues.right.Hip) || 0);
    }, [inputValues]);

    const handleSubmit = (e) => {
        e.preventDefault()
        const { left, right, dateSelected } = inputValues;
        const selectedData = findClosestData(dateSelected, data);

        // const convertDateSelected = dateSelected > 0 ? new Date(dateSelected).toISOString() : dateSelected
        // const convertDateSelected = dateSelected > 0 ? dateSelected : new Date(dateSelected).getTime() / 1000
        const dateSelectedObj = new Date(dateSelected);
        const convertDateSelected = dateSelectedObj.toISOString()
        console.log('converted date ',convertDateSelected )

        const newData = {
            dateSelected: convertDateSelected,
            newMeasurements: {
                neck_cm: left.Neck,
                shoulder_cm: right.Shoulder,
                chest_cm: left.Chest,
                abdomen_cm: left.Abdomen,
                waist_cm: right.Waist,
                hip_cm: right.Hip,
                r_upper_thigh_cm: right['R-Upper Thigh'],
                l_upper_thigh_cm: left['L-Upper Thigh'],
                r_bicep_cm: right['R-Bicep'],
                l_bicep_cm: left['L-Bicep'],
                r_thigh_cm: right['R-Thigh'],
                l_thigh_cm: left['L-Thigh'],
                r_calf_cm: right['R-Calf'],
                l_calf_cm: left['L-Calf'],
            },
        };


        console.log("post-put",selectedData.created_on=== convertDateSelected )
        console.log("post-put",selectedData.created_on,convertDateSelected )
        // Determine if the data for dateSelected already exists
        if (selectedData.created_on === convertDateSelected ) {
            // PATCH request to update existing data
            axios.patch('http://localhost:5000/api/v1/measurements/39b17fed-61d6-492a-b528-4507290d5423', newData)
                .then(res => {
                    console.log(`Data updated: \n ${JSON.stringify(inputValues)} \n ${res}`);
                    // fetchData(); // Fetch updated data after successful update
                })
                .catch(error => {
                    console.log('Error updating data:', error);
                });
        } else {
            //POST request to create new data
            axios.post('http://localhost:5000/api/v1/measurements/39b17fed-61d6-492a-b528-4507290d5423', newData)
                .then(res => {
                    console.log(`Data submitted: \n ${JSON.stringify(inputValues)} \n ${res}`);
                    // fetchData(); // Fetch updated data after successful creation
                })
                .catch(error => {
                    console.log('Error submitting data:', error);
                });
        }
    };
    useEffect(() => {
        // Update inputValues whenever data changes
        if (data.length > 0) {
            const selectedDate = new Date().getTime();  // Example timestamp
            handleSelectDate(selectedDate);
        }
    }, [data]);
    
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    typography: 'h1',
                    fontSize: { xs: '1rem', md: '3rem', lg: '4rem' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            </Box>
            <Typography color='primary'>In Inches</Typography>
            <MeasurementForm
                handleInputChange={handleInputChange}
                inputValues={inputValues}
                waistHipRatio={waistHipRatio}
                handleSelectDate={handleSelectDate}
            />
            <Box
                gap="0.5rem"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
                <MeasurementModal
                    sx={{ width: '80vw' }}
                    values={{ ...inputValues.left, ...inputValues.right }}
                />
                <Button onClick={handleSubmit} sx={{ width: '80%' }}>Save</Button>
            </Box>
        </Container>
    );
}

export default MeasurementPage;
