import { Card, CardContent, Button, Typography, Container, Box, FormGroup, TextField , Switch, FormControlLabel} from "@mui/material";
import { useEffect, useState } from "react";
import MeasurementForm from "../../MeasurementForm/MeasurementForm";
import { useTheme } from "@mui/system";

// Function to return the correct form view based on the selected method
function getMethodView(selectMethod, handleMethodClick, theme, handleChange, formData, setFormData, inputValues, handleInputChange, handleMeasurementCalculation, handleSwitchChange, toggleUOM, calculateByGirth, isMeasurementFormValid ) {
    const bodyFatRanges = ["12-14", "15-17", "18-20", "21-23", "24-26", "27-29", "30-35", "36-40", "50+"];

    const handleSelectBodyFat = (range) => {
        if (range !== "50<=") {
            const [start, end] = range.split("-").map(Number);
            const selectedBodyFat = start + (end - start) / 2;
            setFormData({
                ...formData,
                body_fat_percentage: selectedBodyFat,
                body_fat_range: [start, end]
            });
        } else {
            setFormData({
                ...formData,
                body_fat_percentage: 50,
                body_fat_range: [50, Infinity]
            });
        }
    };


    switch (selectMethod) {
        case 'manual':
            return (
                <form>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                        <TextField
                            id="body_fat_percentage"
                            autoComplete="body_fat_percentage"
                            name="body_fat_percentage"
                            placeholder='Body Fat%'
                            value={formData.body_fat_percentage}
                            variant="outlined"
                            required
                            onChange={handleChange}
                            sx={{
                                width: '6rem',
                                backgroundColor: 'lightblue',
                                borderRadius: 2,
                                '& .MuiInputBase-input': {
                                    borderRadius: 2,
                                },
                                '& .MuiInputBase-root': {
                                    '&:hover fieldset': {
                                        borderColor: `${theme.palette.primary.main}`,
                                    },
                                },
                            }}
                        />
                        <Typography>%</Typography>
                    </FormGroup>
                </form>
            );
        case 'visual_reference':
            return (
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {bodyFatRanges.map((bodyfat) => {
                        return(
                            <Card
                                key={bodyfat}
                                onClick={() => handleSelectBodyFat(bodyfat)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <CardContent>
                                    <Typography>
                                        {bodyfat}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })}
                </Box>
            );
        case 'measurements':
            return (
                <form>
                    <FormGroup sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>        
                        <FormControlLabel
                            value="top"
                            control={
                                <Switch
                                checked={toggleUOM}
                                onChange={handleSwitchChange}
                                inputProps={{ 'aria-label': 'height unit switch' }}
                                />
                            }
                            label={formData.uom.girth_measurements === 'cm' ? 'metric' : 'imperial'}
                            labelPlacement="top"
                            />           
                        {calculateByGirth && <Typography>{formData.body_fat_percentage}%</Typography>}
                    </FormGroup>
                    <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <MeasurementForm inputValues={inputValues} handleInputChange={handleInputChange} />
                        <Button
                            disabled={!isMeasurementFormValid()}
                            onClick={handleMeasurementCalculation}
                            variant="contained"
                        >
                            Calculate
                        </Button>
                    </FormGroup>

                </form>
            );
        default:
            return null;
    }
}


function BodyFat({ data, handleParentFormChange }) {
    const theme = useTheme();
    const [selectMethod, setSelectMethod] = useState(null);
    const { body_fat_percentage, current_body_weight, height_cm, uom, newMeasurements } = data;
    const [toggleUOM, setToggleUOM] = useState(uom.girth_measurements === 'in');
    const [calculateByGirth, setCalculateByGirth] = useState(false)
    const methods = ['manual', 'visual_reference', 'measurements'];
    const [formData, setFormData] = useState({
        body_fat_percentage: body_fat_percentage || '',
        uom:{
            height: uom.height || 'cm',
            girth_measurements: uom.height === 'ft' ? 'in' : (uom.girth_measurements || 'cm'),
        }
    });


    const [inputValues, setInputValues] = useState({
        dateSelected: new Date().setHours(0, 0, 0, 0) / 1000,
        left: {
            Neck: newMeasurements.neck_cm || 0,
            Chest: newMeasurements.chest_cm || 0,
            Abdomen: newMeasurements.abdomen_cm || 0,
            'L-Bicep': newMeasurements.l_bicep_cm || 0,
            'L-Upper Thigh': newMeasurements.l_upper_thigh_cm || 0,
            'L-Thigh': newMeasurements.l_thigh_cm || 0,
            'L-Calf': newMeasurements.l_calf_cm || 0,
        },
        right: {
            Shoulder: newMeasurements.shoulder_cm || 0,
            Waist: newMeasurements.waist_cm || 0,
            Hip: newMeasurements.hip_cm || 0,
            'R-Bicep': newMeasurements.r_bicep_cm || 0,
            'R-Upper Thigh': newMeasurements.r_upper_thigh_cm || 0,
            'R-Thigh': newMeasurements.r_thigh_cm || 0,
            'R-Calf': newMeasurements.r_calf_cm || 0,
        }
    });

    

    
    const isMeasurementFormValid = () => {
        const requiredFields = [
            'Neck', 'Chest', 'Abdomen', 'L-Bicep', 'L-Upper Thigh', 'L-Thigh', 'L-Calf',
            'Shoulder', 'Waist', 'Hip', 'R-Bicep', 'R-Upper Thigh', 'R-Thigh', 'R-Calf'
        ];
        return requiredFields.every(field => inputValues.left[field] > 0 || inputValues.right[field] > 0);
    };

    const handleMeasurementCalculation = () => {

        let bodyFatUSNavyEqn;
        let waistInCm = inputValues.right['Waist']
        let hipInCm = inputValues.right['Hip'] 
        let neckInCm = inputValues.left['Neck']

        if (formData.uom.girth_measurements === 'in') {
            waistInCm = inputValues.right['Waist'] * 2.54;
            hipInCm = inputValues.right['Hip'] * 2.54;
            neckInCm = inputValues.left['Neck'] * 2.54;
        }
    
        bodyFatUSNavyEqn = 495 / (
            1.29579 - 
            0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 
            0.221 * Math.log10(height_cm)
        ) - 450;
        setFormData({
            ...formData,
            body_fat_percentage: Math.round(bodyFatUSNavyEqn)
        });
        setCalculateByGirth(true);
    };


    const handleSwitchChange = (event) => {
        const newUOM = event.target.checked ? 'in' : 'cm';
        console.log('unit: ',newUOM)
        if (isMeasurementFormValid()) {
            // Convert input values based on the new unit of measurement
            const conversionFactor = (newUOM === 'in') ? 1 / 2.54 : 2.54;
    
            setInputValues(prevValues => ({
                ...prevValues,
                left: {
                    Neck: (prevValues.left['Neck'] * conversionFactor).toFixed(2),
                    Chest: (prevValues.left['Chest'] * conversionFactor).toFixed(2),
                    Abdomen: (prevValues.left['Abdomen'] * conversionFactor).toFixed(2),
                    'L-Bicep': (prevValues.left['L-Bicep'] * conversionFactor).toFixed(2),
                    'L-Upper Thigh': (prevValues.left['L-Upper Thigh'] * conversionFactor).toFixed(2),
                    'L-Thigh': (prevValues.left['L-Thigh'] * conversionFactor).toFixed(2),
                    'L-Calf': (prevValues.left['L-Calf'] * conversionFactor).toFixed(2),
                },
                right: {
                    Shoulder: (prevValues.right['Shoulder'] * conversionFactor).toFixed(2),
                    Waist: (prevValues.right['Waist'] * conversionFactor).toFixed(2),
                    Hip: (prevValues.right['Hip'] * conversionFactor).toFixed(2),
                    'R-Bicep': (prevValues.right['R-Bicep'] * conversionFactor).toFixed(2),
                    'R-Upper Thigh': (prevValues.right['R-Upper Thigh'] * conversionFactor).toFixed(2),
                    'R-Thigh': (prevValues.right['R-Thigh'] * conversionFactor).toFixed(2),
                    'R-Calf': (prevValues.right['R-Calf'] * conversionFactor).toFixed(2),
                }
            }));
        }
    
        setFormData({
            ...formData,
            uom: {
                ...formData.uom,
                girth_measurements: newUOM
            },
        });
    
        handleParentFormChange({
            body_fat_percentage:formData.body_fat_percentage,
            uom: {
                ...uom,
                girth_measurements: newUOM
            },
        });
    
        setToggleUOM(event.target.checked);
    };
    

    // Handle method selection
    const handleMethodClick = (method) => {
        setSelectMethod(method);
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

    // Handle form data change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        if(selectMethod === 'measurements') {
            const dateSelectedObj = new Date(inputValues.dateSelected);
            const convertDateSelected = dateSelectedObj.toISOString()
            const conversionFactor = (uom.girth_measurements === 'in') ? 2.54 : 1;
            const newData = {
                dateSelected: convertDateSelected,
                newMeasurements: {
                    neck_cm: inputValues.left.Neck,
                    shoulder_cm: inputValues.right.Shoulder,
                    chest_cm: inputValues.left.Chest,
                    abdomen_cm: inputValues.left.Abdomen,
                    waist_cm: inputValues.right.Waist,
                    hip_cm: inputValues.right.Hip,
                    r_upper_thigh_cm: inputValues.right['R-Upper Thigh'],
                    l_upper_thigh_cm: inputValues.left['L-Upper Thigh'],
                    r_bicep_cm: inputValues.right['R-Bicep'],
                    l_bicep_cm: inputValues.left['L-Bicep'],
                    r_thigh_cm: inputValues.right['R-Thigh'],
                    l_thigh_cm: inputValues.left['L-Thigh'],
                    r_calf_cm: inputValues.right['R-Calf'],
                    l_calf_cm: inputValues.left['L-Calf'],
                },
            };
            handleParentFormChange({body_fat_percentage: formData.body_fat_percentage, ...newData})
        } else {
            handleParentFormChange({body_fat_percentage: formData.body_fat_percentage})

        }


        console.log('formData : ', formData);
    }, [formData, inputValues]);

    return (
        <>
            <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center', flexWrap:'wrap' }}>
                {methods.map((method) => (
                    <Button
                        key={method}
                        variant='outlined'
                        onClick={() => handleMethodClick(method)}
                        sx={{ cursor: 'pointer' }}
                    >
                        {method.replace("_", " ")}
                    </Button>
                ))}
            </Box>
            {selectMethod && 
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                {getMethodView(selectMethod,handleMethodClick , theme, handleChange, formData, setFormData, inputValues, handleInputChange, handleMeasurementCalculation, handleSwitchChange, toggleUOM, calculateByGirth, isMeasurementFormValid )}
            </Box>}
        </>
    );
}

export default BodyFat;
