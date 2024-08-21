import { Card, CardContent, Button, Typography, Image, Container, Box, FormGroup, TextField , Switch, FormControlLabel, Divider, Link} from "@mui/material";
import { useEffect, useState } from "react";
import MeasurementForm from "../../MeasurementForm/MeasurementForm";
import { useTheme } from "@mui/system";
import CustomInput from "../InputFields/CustomInput";
import VisualReferenceImg from '../../../assets/visual-reference-bodies.svg'
import GirthMeasurementsImg from '../../../assets/girth-measurements.svg'


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
                // <form>
                //     <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                //         <TextField
                //             id="body_fat_percentage"
                //             autoComplete="body_fat_percentage"
                //             name="body_fat_percentage"
                //             placeholder='Body Fat%'
                //             value={formData.body_fat_percentage}
                //             variant="outlined"
                //             required
                //             onChange={handleChange}
                //             sx={{
                //                 width: '6rem',
                //                 backgroundColor: 'lightblue',
                //                 borderRadius: 2,
                //                 '& .MuiInputBase-input': {
                //                     borderRadius: 2,
                //                 },
                //                 '& .MuiInputBase-root': {
                //                     '&:hover fieldset': {
                //                         borderColor: `${theme.palette.primary.main}`,
                //                     },
                //                 },
                //             }}
                //         />
                //         <Typography>%</Typography>
                //     </FormGroup>
                // </form>
            );
        case 'visual_reference':
            return (
                // <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                //     {bodyFatRanges.map((bodyfat) => {
                //         return(
                //             <Card
                //                 key={bodyfat}
                //                 onClick={() => handleSelectBodyFat(bodyfat)}
                //                 sx={{ cursor: 'pointer' }}
                //             >
                //                 <CardContent>
                //                     <Typography>
                //                         {bodyfat}%
                //                     </Typography>
                //                 </CardContent>
                //             </Card>
                //         )
                //     })}
                // </Box>
            );
        case 'measurements':
            return (
                // <form>
                //     <FormGroup sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>        
                //         <FormControlLabel
                //             value="top"
                //             control={
                //                 <Switch
                //                 checked={toggleUOM}
                //                 onChange={handleSwitchChange}
                //                 inputProps={{ 'aria-label': 'height unit switch' }}
                //                 />
                //             }
                //             label={formData.uom.girth_measurements === 'cm' ? 'metric' : 'imperial'}
                //             labelPlacement="top"
                //             />           
                //         {calculateByGirth && <Typography>{formData.body_fat_percentage}%</Typography>}
                //     </FormGroup>
                //     <FormGroup sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                //         <MeasurementForm inputValues={inputValues} handleInputChange={handleInputChange} />
                //         <Button
                //             disabled={!isMeasurementFormValid()}
                //             onClick={handleMeasurementCalculation}
                //             variant="contained"
                //         >
                //             Calculate
                //         </Button>
                //     </FormGroup>

                // </form>
            );
        default:
            return null;
    }
}




function BodyFat({ data, handleParentFormChange }) {
    const theme = useTheme();
    const { body_fat_percentage, body_fat_view, current_body_weight, height_cm,uom,newMeasurements} = data;
    const [selectMethod, setSelectMethod] = useState(body_fat_view);
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

    const handleChange = (e, fieldName, inputValue) => {
        console.log(fieldName,"|", inputValue)
        const { name, value } = e ? e.target : {name: fieldName, value: inputValue}

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: fieldName==='current_body_weight'?  parseFloat(value) : value
        }));
        handleParentFormChange({ ...formData, [name]: fieldName==='current_body_weight'?  parseFloat(value) : value });
    };

        // Handle method selection
    const handleMethodClick = (method) => {
        setSelectMethod(method);
        handleChange(null, 'body_fat_view', method)
    };

    return (
        <>
            {!selectMethod ? 
                (<>  
                    <Box>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>MANUAL INPUT</Typography>
                        <CustomInput 
                                fieldName={'body_fat_percentage'}
                                inputLabel={'BF'}
                                options={null}
                                addStyle={{marginBottom:'2vh'}}
                                id={'body-mass'}
                                placeholderText={'Enter your Body Fat %'} 
                                defaultValue={'%'}
                                inputValue={formData.body_fat_percentage}
                                onChange={handleChange}
                                />
                    </Box>
                    <Divider sx={{ width: '80%', marginY: 1, cursor: 'default', userSelect: 'none' }} orientation="horizontal" component="div" role="presentation" aria-hidden="true">Or</Divider>
                    <Box>
                        <Box>
                            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>ESTIMATION METHODS</Typography>
                            <Typography variant="body1" style={{ marginTop: '16px' }}>
                                Choose between two methods for estimating body fat percentage: visual representation (selecting the photo that best matches your body composition) or girth measurements using the <Link href='https://www.calculator.net/body-fat-calculator.html' sx={{fontStyle:'italic',  textDecoration: 'none',}}>US Navy method</Link>. 
                            </Typography>
                            <Typography variant="body1" style={{ fontSize:'0.8rem' ,marginTop: '16px' }}>
                                <span style={{ fontWeight: 'bold' }}>Disclaimer</span>: Both methods offer approximations and may not be fully accurate. For precise assessments, please consult a healthcare professional
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems='center' mt={2} gap={2}>
                            <Button onClick={()=>handleMethodClick('visual_reference')}
                                sx={{ 
                                    p: 0, 
                                    width: '40vw',
                                    display: 'flex',
                                }}
                                >
                                <Card sx={{
                                    transition: 'opacity 0.3s',
                                    width:'100%',
                                    '&:hover': {
                                        opacity: 0.3,
                                        backgroundColor:'white'
                                    }
                                }}>
                                    <CardContent>
                                        <img src={VisualReferenceImg} alt="Visual Reference" style={{ width: '100%', height: 'auto' }} />
                                        <Typography variant="subtitle6" style={{ fontWeight: 'bold' }}>Visual Reference</Typography>
                                    </CardContent>
                                </Card>
                            </Button>
                            <Button onClick={()=>handleMethodClick('measurements')}
                                sx={{ 
                                    p: 0,
                                    width: '40vw',
                                    display: 'flex',
                                }}
                                >
                                <Card sx={{
                                        transition: 'opacity 0.3s',
                                        width:'100%',
                                        '&:hover': {
                                            opacity: 0.3,
                                            backgroundColor:'white'
                                        }
                                    }}>
                                    <CardContent>
                                        <img src={GirthMeasurementsImg} alt="Girth Measurements" style={{ width: '100%', height: 'auto' }} />
                                        <Typography variant="subtitle6" style={{ fontWeight: 'bold' }}>Girth Measurements</Typography>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Box>

                    </Box>
                </>) : (
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
                )

            }
        </>
    );
}

export default BodyFat;
