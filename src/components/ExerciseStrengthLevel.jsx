import { Box, Typography, LinearProgress, Stack, Button, Chip} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import {getProgressColour} from '../utils/utils'
import { UserDataContext } from '../Contexts/UserDataContext';
import {useContext, useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import {convertLbtoKg} from '../utils/utils'

function ExerciseStrengthLevel ({
                                date_calculated,
                                exercise_name,
                                group,
                                body_weight,
                                relative_strength_demographic,
                                one_rep_max,
                                reps,
                                lift,
                                sets,
                                strength_level,
                                next_strength_level,
                                strength_bounds,
                                score,
                                img_url,
                                view}) {

    const navigate = useNavigate()                           
    const theme = useTheme();
    const dateFormatted = new Date(date_calculated)
    const progressValue = parseFloat((((one_rep_max - strength_bounds[strength_level]) / (strength_bounds[next_strength_level]-strength_bounds[strength_level])) * 100).toFixed(1));
    const relative_strength = (one_rep_max/body_weight).toFixed(2)
    const {userData} = useContext(UserDataContext)
    const strengthLevelColor = getProgressColour(strength_level, theme)
    const [displayValues, setDisplayValues] = useState({
        display_one_rep_max: one_rep_max,
        display_strength_level: strength_bounds[strength_level],
        display_next_level: strength_bounds[next_strength_level],
        display_lift:lift
    });
    
    useEffect(() => {
        console.log('userData.uom.lift_weight.uom',userData.uom.lift_weight.uom)
        const display_one_rep_max = userData.uom.lift_weight.uom === 'lb' ? one_rep_max : convertLbtoKg(one_rep_max);
        const display_strength_level = userData.uom.lift_weight.uom === 'lb' ? strength_bounds[strength_level] : convertLbtoKg(strength_bounds[strength_level]);
        const display_next_level = userData.uom.lift_weight.uom === 'lb' ? strength_bounds[next_strength_level] :convertLbtoKg(strength_bounds[next_strength_level]);
        const display_lift = userData.uom.lift_weight.uom === 'lb' ? lift : convertLbtoKg(lift);
    
        setDisplayValues({
            display_one_rep_max,
            display_strength_level,
            display_next_level,
            display_lift
        });
    }, [userData, one_rep_max, strength_bounds, strength_level, next_strength_level, lift]);
    
    // Now you can use displayValues in your component
    const { display_one_rep_max, display_lift, display_strength_level, display_next_level } = displayValues;

    return(
        <Box >
        <Box sx={{ display: 'flex', justifyContent:'space-evenly'}}>
            <Box display='flex' flexDirection='column' sx={{gap:'0.5rem', width:'100%'}} >
                <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                    {score && <Typography fontSize="0.8rem" variant='h6'>{score.toFixed(2)} </Typography>}
                    <Typography fontSize="0.7rem">Calculated on {dateFormatted.toLocaleDateString()}</Typography>
                </Stack>
                <Stack direction='row' justifyContent={'space-between'}>
                    <Stack direction='row' spacing='0.5rem'>
                        <Box sx={{ border: '1px solid gray', height: '4rem', width: '4rem', aspectRatio: "1/1", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={img_url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} alt={`${exercise_name}`} />
                        </Box>
                        <Stack>
                            <Typography fontSize="0.7rem" variant='h6'>{strength_level}</Typography>
                            <Typography flexWrap='wrap' fontWeight='bold'>{exercise_name}</Typography>
                            {view && <Typography fontSize="0.7rem">{group}</Typography>}
                        </Stack>
                    </Stack>
                    <Box>
                        <Button variant='outlined' onClick={()=>{navigate(`/strength/${exercise_name}`)}}>log</Button>
                    </Box>
                </Stack>
                <Stack direction='column' >
                    <Typography fontSize='0.8rem'><b>Relative Strength</b> {relative_strength} times your body weight</Typography>
                    <Typography fontSize='0.8rem'><b>Last Performed</b> {display_lift }{userData.uom.lift_weight.uom} | {reps} reps | {sets} sets</Typography>
                    <Typography fontSize='0.8rem'><b>One Rep Max</b> {display_one_rep_max}{userData.uom.lift_weight.uom}</Typography>
                    <Typography fontSize='0.8rem'><b>Stronger than</b> {relative_strength_demographic}% of your group</Typography>
                    {!(strength_level==="elite") && <Typography fontSize='0.8rem'><b>Next Level</b> {next_strength_level}</Typography>}

                </Stack>
            </Box>
        </Box>
        <Box sx={{mt:'0.8rem'}}>
        <Box sx={{ display: 'flex', justifyContent:'space-between'}}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent:'space-between', 
                width:`${progressValue}%`
            }}
                >
                <Box></Box>
                <Typography fontSize={'0.8rem'} sx={{position: "relative", right:(progressValue > 80? '0.5rem':'-0.5rem')}}>{strength_level === "elite" ? null : (progressValue > 0 ? `${progressValue}%` : null)}</Typography>
            </Box>
        </Box>
    
        <LinearProgress
            variant="determinate"
            value={strength_level === "elite" ? 100 : (progressValue < 0 ? 0 : progressValue)}
            sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#DEDBDE', 
                '& .MuiLinearProgress-bar': {
                    bgcolor: strengthLevelColor, 
                },
            }}
            />
        <Box sx={{display:'flex', justifyContent:'space-between'}}>
            {/* Value at current level */}
            <Typography fontSize={'0.8rem'}>{display_strength_level}{userData.uom.lift_weight.uom}</Typography>
            {/* Value at next level */}
            <Typography fontSize={'0.8rem'}>{strength_level==="elite"? display_one_rep_max : display_next_level}{userData.uom.lift_weight.uom}</Typography>
        </Box>
        </Box>
    </Box>
    )
}

export default ExerciseStrengthLevel;