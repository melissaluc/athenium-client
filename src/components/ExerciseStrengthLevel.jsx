import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea, CardActions, Button} from "@mui/material";
import { useTheme } from '@mui/material/styles';

function getProgressColour(strengthLevel, theme) {
    
    let colour = null;
    switch (strengthLevel) {
        case "beg":
            colour = theme.palette.progress.level1;
            break;
        case "nov":
            colour = theme.palette.progress.level2;
            break;
        case "int":
            colour = theme.palette.progress.level3;
            break;
        case "adv":
            colour = theme.palette.progress.level4;
            break;
        case "elite":
            colour = theme.palette.progress.level5;
            break;
        default:
            colour = null;
    }
    console.log({strength: strengthLevel, colour: colour})
    return colour;
}

function ExerciseStrengthLevel ({
                                date_calculated,
                                exercise_name,
                                category,
                                body_weight,
                                relative_strength_demographic,
                                relative_strength,
                                one_rep_max,
                                strength,
                                strength_level,
                                next_strength_level,
                                strength_boundaries,
                                view}) {
                                
    const theme = useTheme();
    const dateFormatted = new Date(date_calculated)
    const progressValue = parseFloat(((strength - strength_boundaries[strength_level]) / (strength_boundaries[strength_level]) * 100).toFixed(1));

    return(
        <Box>
        <Box sx={{ display: 'flex', justifyContent:'space-evenly'}}>
            <Box sx={{backgroundColor:'gray', height:'auto', width:'4rem',aspectRatio:"1/1"}}>Img</Box>
            <Box>
                {view && <Typography fontSize="0.7rem">{category}</Typography>}
                <Typography>{exercise_name}</Typography>
                <Typography fontSize="0.7rem">Updated on {dateFormatted.toLocaleDateString()}</Typography>
                <Box sx={{ display: 'flex', justifyContent:'space-evenly', gap:"1rem"}}>
                    {/* <Typography fontSize=''>{`${relative_strength_demographic}% stronger than female lifters with similar stats`}</Typography> */}
                    <Box>
                        <Typography>Your Lift is:</Typography>
                        <Typography>{relative_strength} times your body weight</Typography>
                    </Box>

                    <Box>
                        <Typography>One rep Max</Typography>
                        <Typography>{one_rep_max}lbs</Typography>
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
                <Typography sx={{position: "relative", right:'-2rem'}}>{strength_level === "elite" ? null : (progressValue > 0 ? `${strength}(${progressValue}%)` : null)}</Typography>
            </Box>
            <Typography>{next_strength_level}</Typography>
        </Box>
    
        <LinearProgress
            variant="determinate"
            value={strength_level === "elite" ? 100 : progressValue < 0 ? 0 : progressValue}
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
            <Typography>{strength_boundaries[strength_level]}</Typography>
            {/* Value at next level */}
            <Typography>{strength_level==="elite"? strength :strength_boundaries[next_strength_level]}</Typography>
        </Box>
        </Box>
    </Box>
    )
}

export default ExerciseStrengthLevel;