import { Box, Typography, LinearProgress} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import {getProgressColour} from '../utils/utils'

function ExerciseStrengthLevel ({
                                date_calculated,
                                exercise_name,
                                group,
                                body_weight,
                                relative_strength_demographic,
                                one_rep_max,
                                reps,
                                lift,
                                strength_level,
                                next_strength_level,
                                strength_bounds,
                                score,
                                img_url,
                                view}) {
                                
    const theme = useTheme();
    const dateFormatted = new Date(date_calculated)
    const progressValue = parseFloat((((one_rep_max - strength_bounds[strength_level]) / (strength_bounds[strength_level])) * 100).toFixed(1));
    const relative_strength = (one_rep_max/body_weight).toFixed(2)
    return(
        <Box>
        <Box sx={{ display: 'flex', justifyContent:'space-evenly'}}>
            <Box sx={{ border: '1px solid gray', height: '4rem', width: '4rem', aspectRatio: "1/1", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={img_url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} alt="Image" />
            </Box>
            <Box>
                {view && <Typography fontSize="0.7rem">{group}</Typography>}
                <Typography>{exercise_name}</Typography>
                <Typography fontSize="0.7rem">Updated on {dateFormatted.toLocaleDateString()}</Typography>
                <Box sx={{ display: 'flex', justifyContent:'space-evenly', gap:"1rem"}}>
                    {/* <Typography fontSize=''>{`${relative_strength_demographic}% stronger than female lifters with similar stats`}</Typography> */}
                    <Box>
                        <Typography>Your Lift is {lift}lbs x {reps}</Typography>
                        <Typography>{relative_strength} times your body weight</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
        <Box>
        <Box sx={{ display: 'flex', justifyContent:'space-between'}}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent:'space-between', 
                width:`${progressValue}%`
            }}
                >
                <Typography>{strength_level}</Typography>
                <Typography sx={{position: "relative", right:(progressValue > 80? '1.5rem':'-1.5rem')}}>{strength_level === "elite" ? null : (progressValue > 0 ? `${one_rep_max}(${progressValue}%)` : null)}</Typography>
            </Box>
            <Typography>{next_strength_level ? next_strength_level : ""}</Typography>
        </Box>
    
        <LinearProgress
            variant="determinate"
            value={strength_level === "elite" ? 100 : (progressValue < 0 ? 0 : progressValue)}
            sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: '#DEDBDE',
                '& .MuiLinearProgress-bar': {
                    bgcolor: getProgressColour(strength_level, theme), 
                },
            }}
            />
        <Box sx={{display:'flex', justifyContent:'space-between'}}>
            {/* Value at current level */}
            <Typography>{strength_bounds[strength_level]}</Typography>

            {/* Value at next level */}
            <Typography>{strength_level==="elite"? one_rep_max : strength_bounds[next_strength_level]}</Typography>

        </Box>
        </Box>
    </Box>
    )
}

export default ExerciseStrengthLevel;