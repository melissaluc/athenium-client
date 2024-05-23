import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea, CardActions, Button, CardHeader} from "@mui/material"; 
import { startOfWeek, endOfWeek, isWithinInterval, format } from 'date-fns';

function DailyNutritionSummary ({data}) {
    return(

        <Box onClick={()=>{}} sx={{
            borderBottom:'1px solid black',
            '&:last-child': {
                borderBottom: 'none',
                },
            padding:'0.5rem 0',
            display:'flex', 
            justifyContent:'space-between'}}>
            <Typography>{format(new Date(data.date), 'MMM dd')}</Typography>
            <Box sx={{display:'flex', justifyContent:'space-between', width:'70%'}}>
                <Box>
                    <Typography>Protein</Typography>
                    <Typography>{data.macros_g.protein} g</Typography>
                </Box>
                <Box>
                    <Typography>Carbs</Typography>
                    <Typography>{data.macros_g.carbs} g</Typography>
                </Box>
                <Box>
                    <Typography>Fat</Typography>
                    <Typography>{data.macros_g.fat} g</Typography>
                </Box>
                <Typography>{data.totalCalories} cal</Typography>
            </Box>
        </Box>


    )
}


export default DailyNutritionSummary;