import { Button, FormGroup, Switch, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";
import MeasurementForm from "../../../MeasurementForm/MeasurementForm";
import CustomInput from "../../InputFields/CustomInput";

function GirthMeasurements({ data, handleChange }) {
    const [toggleUOM, setToggleUOM] = useState(data.uom.girth_measurements === 'in');

    const [formData, setFormData] = useState({
        uom: {
            height: data.uom.height || 'cm',
            girth_measurements: data.uom.girth_measurements || 'cm',
            body_fat_percentage:data.body_fat_percentage || ''
        }
    });


    const [inputValues, setInputValues] = useState({
        dateSelected: new Date(),
        left: {
            Neck: data.newMeasurements.neck_cm || 0,
            Chest: data.newMeasurements.chest_cm || 0,
            Abdomen: data.newMeasurements.abdomen_cm || 0,
            'L-Bicep': data.newMeasurements.l_bicep_cm || 0,
            'L-Upper Thigh': data.newMeasurements.l_upper_thigh_cm || 0,
            'L-Thigh': data.newMeasurements.l_thigh_cm || 0,
            'L-Calf': data.newMeasurements.l_calf_cm || 0,
        },
        right: {
            Shoulder: data.newMeasurements.shoulder_cm || 0,
            Waist: data.newMeasurements.waist_cm || 0,
            Hip: data.newMeasurements.hip_cm || 0,
            'R-Bicep': data.newMeasurements.r_bicep_cm || 0,
            'R-Upper Thigh': data.newMeasurements.r_upper_thigh_cm || 0,
            'R-Thigh': data.newMeasurements.r_thigh_cm || 0,
            'R-Calf': data.newMeasurements.r_calf_cm || 0,
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
        let bodyFatPercentage;
        let waistInCm = inputValues.right['Waist'];
        let hipInCm = inputValues.right['Hip'];
        let neckInCm = inputValues.left['Neck'];
    
        if (formData.uom.girth_measurements === 'in') {
            waistInCm = inputValues.right['Waist'] * 2.54;
            hipInCm = inputValues.right['Hip'] * 2.54;
            neckInCm = inputValues.left['Neck'] * 2.54;
        }
    
        if (data.gender === 'Male') {
            bodyFatPercentage = 495 / (
                1.0324 - 
                0.19077 * Math.log10(waistInCm - neckInCm) + 
                0.15456 * Math.log10(data.height_cm)
            ) - 450;
        } else if (data.gender === 'Female') {
            bodyFatPercentage = 495 / (
                1.29579 - 
                0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 
                0.221 * Math.log10(data.height_cm)
            ) - 450;
        } else {
            console.error('Unexpected gender value:', data.gender);
            return;
        }
    
        const roundedBodyFat = Math.round(bodyFatPercentage);
    
        setFormData(prevFormData => ({
            ...prevFormData,
            body_fat_percentage: roundedBodyFat
        }));
        
        // const dateSelectedObj = new Date(inputValues.dateSelected);
        // const convertDateSelected = dateSelectedObj.toISOString();
        const conversionFactor = (data.uom.girth_measurements === 'in') ? 2.54 : 1;
        const newData = {
            dateSelected: inputValues.dateSelected,
            newMeasurements: {
                neck_cm: inputValues.left.Neck*conversionFactor,
                shoulder_cm: inputValues.right.Shoulder*conversionFactor,
                chest_cm: inputValues.left.Chest*conversionFactor,
                abdomen_cm: inputValues.left.Abdomen*conversionFactor,
                waist_cm: inputValues.right.Waist*conversionFactor,
                hip_cm: inputValues.right.Hip*conversionFactor,
                r_upper_thigh_cm: inputValues.right['R-Upper Thigh']*conversionFactor,
                l_upper_thigh_cm: inputValues.left['L-Upper Thigh']*conversionFactor,
                r_bicep_cm: inputValues.right['R-Bicep']*conversionFactor,
                l_bicep_cm: inputValues.left['L-Bicep']*conversionFactor,
                r_thigh_cm: inputValues.right['R-Thigh']*conversionFactor,
                l_thigh_cm: inputValues.left['L-Thigh']*conversionFactor,
                r_calf_cm: inputValues.right['R-Calf']*conversionFactor,
                l_calf_cm: inputValues.left['L-Calf']*conversionFactor,
            },
        };
        
        handleChange(null, "newMeasurements", newData)
        handleChange(null, "body_fat_percentage", roundedBodyFat);
    };

    const handleSwitchChange = (event) => {
        const newUOM = event.target.checked ? 'in' : 'cm';
  
        const updatedUOM = {
            ...formData.uom,
            girth_measurements: newUOM
        };
        
        handleChange(null, 'uom', updatedUOM);
        setToggleUOM(event.target.checked);
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
        const dateSelectedObj = new Date(inputValues.dateSelected);
        const convertDateSelected = dateSelectedObj.toISOString();
        const conversionFactor = (data.uom.girth_measurements === 'in') ? 2.54 : 1;
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
        handleChange(null, "newMeasurements", newData)
    }, [formData, inputValues]);

    return (
        <form>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                {/* <CustomInput 
                    fieldName={'body_fat_percentage'}
                    inputLabel={'BF'}
                    options={null}
                    addStyle={{ flexGrow: 1 }}  // Ensure input takes up available space
                    id={'body-mass'}
                    placeholderText={'Result'} 
                    defaultValue={'%'}
                    inputValue={formData.body_fat_percentage}  // Use the local state for the input value
                    onChange={(e) => setFormData(prevFormData => ({
                        ...prevFormData,
                        body_fat_percentage: e.target.value
                    }))}
                /> */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={toggleUOM}
                            onChange={handleSwitchChange}
                            inputProps={{ 'aria-label': 'height unit switch' }}
                        />
                    }
                    label={formData.uom.girth_measurements === 'cm' ? 'Metric' : 'Imperial'}
                    labelPlacement="top"
                />
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
}

export default GirthMeasurements;
