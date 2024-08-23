import { Card, CardContent, Button, Typography, Container, Box, FormGroup, TextField , Switch, FormControlLabel} from "@mui/material";
import CustomInput from "../../InputFields/CustomInput";
import {useState, useEffect} from 'react'
import FBF12to14 from '../../../../assets/bodyfatref/female/12-14.png'
import FBF15to17 from '../../../../assets/bodyfatref/female/15-17.png'
import FBF18to20 from '../../../../assets/bodyfatref/female/18-20.png'
import FBF21to23 from '../../../../assets/bodyfatref/female/21-23.png'
import FBF24to26 from '../../../../assets/bodyfatref/female/24-26.png'
import FBF27to29 from '../../../../assets/bodyfatref/female/27-29.png'
import FBF30to35 from '../../../../assets/bodyfatref/female/30-35.png'
import FBF36to40 from '../../../../assets/bodyfatref/female/36-40.png'
import FBF50 from '../../../../assets/bodyfatref/female/50.png'
import MBF4to5 from '../../../../assets/bodyfatref/male/4-5.png'
import MBF13to15 from '../../../../assets/bodyfatref/male/13-15.png'
import MBF16to19 from '../../../../assets/bodyfatref/male/16-19.png'
import MBF20to24 from '../../../../assets/bodyfatref/male/20-24.png'
import MBF25to30 from '../../../../assets/bodyfatref/male/25-30.png'
import MBF35to40 from '../../../../assets/bodyfatref/male/35-40.png'
import MBF6to7 from '../../../../assets/bodyfatref/male/6-7.png'
import MBF8to10 from '../../../../assets/bodyfatref/male/8-10.png'


function VisualReference({data, handleChange}) {
    const [selectBF, setSelectBF] = useState(data.body_fat_range)
    let bodyFatRanges 
    if(data.gender==='Female'){
        bodyFatRanges = [
            {img: FBF12to14, range:"12-14"},
            {img: FBF15to17, range:"15-17"},
            {img: FBF18to20, range:"18-20"},
            {img: FBF21to23, range:"21-23"},
            {img: FBF24to26, range:"24-26"},
            {img: FBF27to29, range:"27-29"},
            {img: FBF30to35, range:"30-35"},
            {img: FBF36to40, range:"36-40"},
            {img: FBF50, range:"50+"},

        ]
    } else {
        bodyFatRanges = [
            {img: MBF4to5, range:"4-5"},
            {img: MBF6to7, range:"6-7"},
            {img: MBF8to10, range:"8-10"},
            {img: MBF13to15, range:"13-15"},
            {img: MBF16to19, range:"16-19"},
            {img: MBF20to24, range:"20-24"},
            {img: MBF25to30, range:"25-30"},
            {img: MBF35to40, range:"35-40"},
        ]
    }




    const handleSelectBodyFat = (range) => {
        setSelectBF(range)
        let newBodyFat;
        if (range !== "50+") {
            const [start, end] = range.split("-").map(Number);
            newBodyFat = start + (end - start) / 2;
        } else {
            newBodyFat = 50;
        }
        handleChange(null, 'body_fat_percentage', newBodyFat);
        handleChange(null, 'body_fat_range', range);

    };


   return (
        <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
            {/* <CustomInput 
                fieldName={'body_fat_percentage'}
                inputLabel={'BF'}
                options={null}
                addStyle={{flexGrow: 1 }}  // Ensure input takes up available space
                id={'body-mass'}
                placeholderText={'Result'} 
                defaultValue={'%'}
                inputValue={data.body_fat_percentage}
                onChange={handleChange}
            /> */}
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                {bodyFatRanges.map((bodyfat) => {
                                    return(
                                        <Card 
                                            key={bodyfat.range}
                                            onClick={() => handleSelectBodyFat(bodyfat.range)}
                                            sx={{ cursor: 'pointer',
                                                border:selectBF === bodyfat.range ? '4px solid #9b6eded6': 'none'
                                            }}
                                        >
                                            <CardContent sx={{display:'flex',flexDirection:'column', alignItems:'center' }}>
                                                <img src={bodyfat.img} alt={`${data.gender}-body-fat-${bodyfat.range}`} style={{ width: '100px', height: 'auto' }} />
                                                <Typography fontWeight={'bold'}>
                                                    {bodyfat.range}%
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
            </Box>
        </Box>
    )
}

export default VisualReference;
