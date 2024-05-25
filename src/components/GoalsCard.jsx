import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea,CardHeader, CardActions, Button} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";

function getProgressColour(progress) {
    let colour = null;

    if (progress < 25) {
        colour = "#ADD5F7"; // Light Blue
    } else if (progress < 50) {
        colour = "#7FB2F0"; // Medium Blue
    } else if (progress < 75) {
        colour = "#4E7AC7"; // Dark Blue
    } else if (progress < 100) {
        colour = "#1e3f6b"; // Darkest Blue
    } else if (progress === 100) {
        colour = "#00d664"; // Green
    }

    return colour;
}

function GoalProgress ({
                        name,
                        category,
                        description,
                        metric,
                        units,
                        updated_on,
                        start_date,
                        target_value,
                        current_value,
                        start_value,
                        status}) {
    const [expandWorkout, setExpandWorkout] = useState(false)
    const updateDateFormatted = new Date(updated_on*1000)
    const startDateFormatted = new Date(start_date*1000)
    const progressValue = parseFloat(((current_value / target_value) * 100).toFixed(1));
    // const emoji = status === "achieved" ? "🌟" : status === "in progress" ? "💪" : "⏱";                  
    return(
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection:'column', justifyContent:'flex-start', gap:'0.5rem'}}>
                    <Box sx={{ display: 'flex', justifyContent:'space-between'}}>
                        <Box>
                            <Typography fontSize={'0.7rem'}>{status.toUpperCase()}</Typography>
                            <Typography fontSize="0.7rem">Updated on {updateDateFormatted.toLocaleDateString()}</Typography>
                            {/* <Typography fontSize={'0.7rem'}>{emoji}</Typography> */}
                        </Box>

                        <Button>Edit</Button>
                    </Box>
                    <Box>
                        <Typography fontSize={'0.7rem'}>{category}</Typography>
                        <Typography fontWeight={'bold'}>{name}</Typography>

                        <Box sx={{ display: 'flex', justifyContent:'space-evenly', gap:"1rem"}}>
                        </Box>
                    </Box>
                </Box>
                <Box>
                <Box sx={{ display: 'flex', justifyContent:'space-between'}}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent:'flex-end', 
                        width:`${progressValue}%`
                    }}
                        >
                        <Typography sx={{position: "relative", right:'-2rem'}}>{status === "achieved" ? null : (progressValue > 0 ? `${current_value}(${progressValue}%)` : null)}</Typography>
                    </Box>

                </Box>
            
                <LinearProgress
                    variant="determinate"
                    value={status === "achieved" ? 100 : progressValue < 0 ? 0 : progressValue}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#DEDBDE',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: getProgressColour(progressValue), 
                        },
                    }}
                />
                <Box sx={{display:'flex', justifyContent:'space-between'}}>
                    {/* Value at current level */}
                    <Typography>{start_value}{units}</Typography>
                    {/* Value at next level */}
                    <Typography>{current_value === "achieved"? `${current_value}${units}` : `${target_value}${units}`}</Typography>
                </Box>
                </Box>
                {expandWorkout &&    
                <Box>
                    <Box sx={{margin:'0.7rem 0',padding:'0.5rem 0', borderTop:'1px solid black', borderBottom:'1px solid black'}}>
                        <Typography fontSize='0.8rem'>{`Metric: ${metric}`.toUpperCase()}</Typography>
                        <Typography fontSize='0.8rem'>{`Units: ${units}`.toUpperCase()}</Typography>
                        <Typography fontSize='0.8rem'>{`Start Date: ${startDateFormatted.toLocaleDateString()}`.toUpperCase()}</Typography>
                    </Box>
                    <Typography>
                        {description}
                    </Typography>
                </Box>
                }
            </CardContent>
            <CardActionArea>
                <CardActions sx={{width:'100%', margin:'0px', padding:'0px'}}>
                    <Button onClick={()=>{ setExpandWorkout(prev => !prev)}} sx={{width:'100%', margin:'0px', padding:'0px'}}>
                
                            <ArrowDropDownIcon sx={{transform: expandWorkout? 'scaleY(-1)': 'none'}}/>
            
                    </Button>
                </CardActions>
            </CardActionArea>
        </Card>
    )
}

export default GoalProgress;