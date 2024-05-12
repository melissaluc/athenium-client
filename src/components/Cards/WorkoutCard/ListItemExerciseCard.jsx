import { Box, Container, Typography, Button, Card, CardActionArea, CardActions
    ,CardContent } from "@mui/material"; 


function WeightLiftingTemplate ({data}) {
    return(
        <Box sx={{display:'flex', gap:'1rem'}}>
        <Box sx={{width:'4rem', height:'4rem', backgroundColor:'gray', display:'flex'}}>
            Img
        </Box>
        <Box sx={{width:'100%'}}>
            <Box sx={{display:'flex', justifyContent:'space-evenly'}}>
                <Typography>{data.exercise_name}</Typography>
                <Box>
                    <Typography>Weight</Typography>
                    <Typography>{data.weight}</Typography>
                </Box>
                <Box>
                    <Typography>Reps</Typography>
                    <Typography>{data.reps}</Typography>
                </Box>
                <Box>
                    <Typography>Sets</Typography>
                    <Typography>{data.sets}</Typography>
                </Box>
            </Box>
        </Box>
    </Box>
    )
}

function CardioTemplate ({data}) {
    return(
        <Box sx={{display:'flex', gap:'1rem'}}>
        <Box sx={{width:'4rem', height:'4rem', backgroundColor:'gray', display:'flex'}}>
            Img
        </Box>
        <Box sx={{width:'100%'}}>
            <Box sx={{display:'flex', justifyContent:'space-evenly'}}>
                <Typography>{data.exercise_name}</Typography>
                <Box>
                    <Typography>Duration</Typography>
                    <Typography>{data.duration ? data.duration :"-"}</Typography>
                </Box>
                <Box>
                    <Typography>Distance</Typography>
                    <Typography>{data.distance ? data.distance :"-"}</Typography>
                </Box>
            </Box>
        </Box>
    </Box>
    )
}


function getTemplate(data) {
    switch (data.category) {
        case 'strength':
            return <WeightLiftingTemplate data={data}/>;
        case 'cardio':
            return <CardioTemplate data={data}/>;
        default:
        return null;
    }
    }


function ListItemExerciseCard ({data}) {


    
    return(
        getTemplate(data)
    )
}

export default ListItemExerciseCard;