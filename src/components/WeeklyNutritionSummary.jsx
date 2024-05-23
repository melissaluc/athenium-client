import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea, CardActions, Button, CardHeader} from "@mui/material"; 
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';
import DailyNutritionSummary from "./DailyNutritionSummary";

function WeeklyNutritionSummary ({week, data}) {
    return(
        <Box>        
            <Box sx={{borderBottom:'2px solid black', marginBottom:'0.5rem', display:'flex', justifyContent:'space-between'}}>
                <Typography fontWeight="bold">Week {format(new Date(week), 'MMM dd, yyyy')}</Typography>
                <Typography fontWeight="bold">{data.totalCalories} cal</Typography>
            </Box>
            {
                Object.entries(data.days).map(([key, value, index])=>{
                    
                    return <DailyNutritionSummary data={value}/>
                })
            }

        </Box>
    )
}


export default WeeklyNutritionSummary