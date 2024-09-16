import { Button, Typography, Container, Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import MeasurementForm from '../components/MeasurementForm/MeasurementForm';
import MeasurementModal from '../components/MeasurementModal';
import axiosInstance from '../utils/axiosConfig';
import {findClosestData, convertCmtoIn, convertIntoCm} from '../utils/utils'
import { UserDataContext } from '../Contexts/UserDataContext';

function MeasurementPage() {
    const {userData}= useContext(UserDataContext);
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
        axiosInstance.get(`/measurements`)
            .then(response => {
                setData(response.data);  // Make sure response.data is correctly set
                const currentTime = new Date().getTime();
                handleSelectDate(currentTime);  // Ensure handleSelectDate is called correctly
            })
            .catch(error => {
                console.log(error);
            });
    }, [userData]);
    

    

    const handleSelectDate = (selectedDate) => {
        const selectedData = findClosestData(selectedDate, data);
        if (selectedData) {
            const convertedMeasurements = (measurements) => {
                if (userData.uom.girth_measurements.uom !== 'cm') {
                    return Object.keys(measurements).reduce((acc, key) => {
                        acc[key] = convertCmtoIn(measurements[key] || 0);
                        return acc;
                    }, {});
                }
                return measurements;
            };
    
            const convertedLeft = convertedMeasurements({
                Neck: selectedData.neck_cm,
                Chest: selectedData.chest_cm,
                Abdomen: selectedData.abdomen_cm,
                'L-Bicep': selectedData.l_bicep_cm,
                'L-Upper Thigh': selectedData.l_upper_thigh_cm,
                'L-Thigh': selectedData.l_thigh_cm,
                'L-Calf': selectedData.l_calf_cm,
            });
    
            const convertedRight = convertedMeasurements({
                Shoulder: selectedData.shoulder_cm,
                Waist: selectedData.waist_cm,
                Hip: selectedData.hip_cm,
                'R-Bicep': selectedData.r_bicep_cm,
                'R-Upper Thigh': selectedData.r_upper_thigh_cm,
                'R-Thigh': selectedData.r_thigh_cm,
                'R-Calf': selectedData.r_calf_cm,
            });
    
            const newData = {
                dateSelected: selectedDate,
                left: {
                    ...inputValues.left,
                    ...convertedLeft,
                },
                right: {
                    ...inputValues.right,
                    ...convertedRight,
                },
            };
    
            setInputValues(newData);
            console.log('new inputvalues', newData);
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

        //  Convert measurements back to cm if in inches 
        let convertedLeft = left;
        let convertedRight = right;
    
        // Convert all measurements to cm if they are in inches
        if (userData.uom.girth_measurements.uom === 'in') {
            convertedLeft = Object.keys(left).reduce((acc, key) => {
                acc[key] = convertIntoCm(left[key]);
                return acc;
            }, {});
    
            convertedRight = Object.keys(right).reduce((acc, key) => {
                acc[key] = convertIntoCm(right[key]);
                return acc;
            }, {});
        }
        const newData = {
            dateSelected: convertDateSelected,
            newMeasurements: {
                neck_cm: convertedLeft.Neck,
                shoulder_cm: convertedRight.Shoulder,
                chest_cm: convertedLeft.Chest,
                abdomen_cm: convertedLeft.Abdomen,
                waist_cm: convertedRight.Waist,
                hip_cm: convertedRight.Hip,
                r_upper_thigh_cm: convertedRight['R-Upper Thigh'],
                l_upper_thigh_cm: convertedLeft['L-Upper Thigh'],
                r_bicep_cm: convertedRight['R-Bicep'],
                l_bicep_cm: convertedLeft['L-Bicep'],
                r_thigh_cm: convertedRight['R-Thigh'],
                l_thigh_cm: convertedLeft['L-Thigh'],
                r_calf_cm: convertedRight['R-Calf'],
                l_calf_cm: convertedLeft['L-Calf'],
            },
        };


        console.log("post-put",selectedData.created_on=== convertDateSelected )
        console.log("post-put",selectedData.created_on,convertDateSelected )
        // Determine if the data for dateSelected already exists
        if (selectedData.created_on === convertDateSelected ) {
            // PATCH request to update existing data
            axiosInstance.patch(`/measurements`, newData)
                .then(res => {
                    console.log(`Data updated: \n ${JSON.stringify(inputValues)} \n ${res}`);
                    // fetchData(); // Fetch updated data after successful update
                })
                .catch(error => {
                    console.log('Error updating data:', error);
                });
        } else {
            //POST request to create new data
            axiosInstance.post(`/measurements`, newData)
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
                padding:'1rem 0'
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
                {/* <MeasurementModal
                    values={{ ...inputValues.left, ...inputValues.right }}
                /> */}
                <Button fullWidth  variant='contained' onClick={handleSubmit} >Save</Button>
            </Box>
        </Container>
    );
}

export default MeasurementPage;
