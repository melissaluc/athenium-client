import { Card, CardContent, Button, Typography, Box,Divider, Link, Container} from "@mui/material";
import {useState } from "react";
import VisualReferenceImg from '../../../assets/visual-reference-bodies.svg'
import GirthMeasurementsImg from '../../../assets/girth-measurements.svg'
import GirthMeasurements from './BodyFatForms/GirthMeasurement'
import VisualReference from './BodyFatForms/VisualReference'
import ManualInput from './BodyFatForms/ManualInput'

function getMethodView(selectMethod,formData, handleChange) {

    switch (selectMethod) {
        case 'manual_input':
            return (
                <ManualInput  data={formData} handleChange={handleChange}/>
            );
        case 'visual_reference':
            return (
                <VisualReference data={formData} handleChange={handleChange} />
            );
        case 'girth_measurements':
            return (
                <GirthMeasurements data={formData} handleChange={handleChange}/>
            );
        default:
            return null;
    }
}




function BodyFat({ data, handleParentFormChange }) {
;
    const { body_fat_percentage, body_fat_view, body_fat_range, height_cm,uom,newMeasurements,gender} = data;
    const [selectMethod, setSelectMethod] = useState(body_fat_view);

    const methods = ['manual_input', 'visual_reference', 'girth_measurements'];
    const [formData, setFormData] = useState({
        body_fat_percentage: body_fat_percentage || '',
        height_cm:height_cm || '',
        newMeasurements:newMeasurements,
        body_fat_range:body_fat_range || null,
        gender:gender || '',
        uom:{
            height: uom.height || 'cm',
            girth_measurements: uom.height === 'ft' ? 'in' : (uom.girth_measurements || 'cm'),
        }
    });

    const handleChange = (e, fieldName, inputValue) => {
        const { name, value } = e ? e.target : { name: fieldName, value: inputValue };
    
        // Ensure numeric fields are handled correctly
        const updatedValue = ['body_fat_percentage', 'height_cm'].includes(name) ? parseFloat(value) : value;
    
        setFormData(prevFormData => {
            const newFormData = { ...prevFormData, [name]: updatedValue };
    
            // Call handleParentFormChange with the updated field
            handleParentFormChange({ [name]: updatedValue });
    
            return newFormData;
        });
    };
    
        // Handle method selection
    const handleMethodClick = (method) => {
        setSelectMethod(method);
        handleChange(null, 'body_fat_view', method)
    };

    return (
        <Container maxWidth='smn'>
            {!selectMethod ? 
                (<Box display={'flex'} sx={{flexDirection:'column', width:'100%', alignItems:'center'}}>  
                    <ManualInput  data={formData} handleChange={handleChange}/>
                    <Divider sx={{ width: '90%', marginY: 1, cursor: 'default', userSelect: 'none' }} orientation="horizontal" component="div" role="presentation" aria-hidden="true">Or</Divider>
                    <Box>
                        <Box width='100%'>
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
                                    width: '80%',
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
                            <Button onClick={()=>handleMethodClick('girth_measurements')}
                                sx={{ 
                                    p: 0,
                                    width: '80%',
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
                                        <img src={GirthMeasurementsImg} alt="Visual Reference" style={{ width: '100%', height: 'auto' }} />
                                        <Typography variant="subtitle6" style={{ fontWeight: 'bold' }}>Girth Measurements</Typography>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Box>

                    </Box>
                </Box>) : (
                <Box  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center',flexWrap:'wrap' }}>
                        {methods.map((method) => (
                            <Button
                                key={method}
                                variant={selectMethod === method  ? 'contained' : 'outlined'}
                                onClick={() => handleMethodClick(method)}
                            >
                                {method.replace("_", " ")}
                            </Button>
                        ))}
                    </Box>
                    {selectMethod && 
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography variant="body1" sx={{ flexShrink: 0}}>
                                {
                                selectMethod.replace("_", " ").split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')
                                }
                            </Typography>
                            <Divider
                                sx={{ flexGrow: 1, marginLeft: 1 }}  // Adjust marginLeft to add space between text and divider
                                orientation="horizontal"
                                component="div"
                                role="presentation"
                                aria-hidden="true"
                            />
                        </Box>
                    }
                    {selectMethod && 
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                        {
                         getMethodView(selectMethod,formData, handleChange)
                         }
                    </Box>}
                </Box>
                )

            }
        </Container>
    );
}

export default BodyFat;
