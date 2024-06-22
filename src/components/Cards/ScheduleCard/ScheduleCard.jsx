import {Typography, Box, Card, CardContent, Button} from '@mui/material';
import {useState} from 'react'


function getTimeDifference(unixTime) {
    const currentTime = Date.now(); // Current Unix time in milliseconds
    const timeDifference = unixTime * 1000 - currentTime; // Convert Unix time to milliseconds and calculate the difference
    if (timeDifference < 60 * 60 * 1000) { // If time difference is less than 1 hour
        const minutes = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
        return `${minutes} min`;
    } else {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert milliseconds to hours
        return `${hours} hrs`;
    }
}

function capitalizeEveryWord(str) {

    let words = str.toLowerCase().split(' ');
  
    words = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
  
    return words.join(' ');
  }



function WorkoutCard ({plannedTime,exerciseList, workoutName,}) {
    const [expanded, setExpanded] = useState(false);
    const unixTimestamp = new Date(plannedTime).getTime() / 1000
    const timeStr = (new Date(unixTimestamp* 1000)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const timeDiff = getTimeDifference(unixTimestamp)
    console.log(timeDiff)
    const toggleExpand = () => {
        setExpanded(!expanded);
      };
    
    const formatExerciseList = () => {
    if (!exerciseList || exerciseList.length === 0) {
        return ''
    }
    return exerciseList.join('  |  ').toUpperCase();
    };

    return (
        <Card >
        <CardContent sx={{}}>
            <Box sx={{display:"flex", justifyContent:"space-between"}}>
                <Typography>{timeStr}</Typography>
                <Typography fontSize="0.7rem">{ timeDiff>0 && `Coming up in ${timeDiff}`}</Typography>
            </Box>
            <Box sx={{display:"flex", gap:"0.5rem"}}>
                <Typography>{workoutName}</Typography>
            </Box>

            <Box sx={{}}>
                {exerciseList && (
                    <Typography
                    fontSize="0.7rem"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
                    >
                    {expanded ? formatExerciseList() : `${formatExerciseList().slice(0, 55)}`}
                    </Typography>
                )}
                {exerciseList && formatExerciseList().length > 55 && (
                    <Box sx={{ marginLeft: '0rem' }}>
                    <Typography
                        onClick={toggleExpand}
                        fontSize="0.5rem"
                        sx={{ cursor: 'pointer', color: 'primary.main' }}
                    >
                        {expanded ? 'Show less' : 'Show more'}
                    </Typography>
                    </Box>
                )}
            </Box>
        </CardContent>
    </Card>
    )}


    function NutritionCard({ plannedTime, macros, uom, foodList, mealName}) {
        const [expanded, setExpanded] = useState(false);
        const unixTimestamp = new Date(plannedTime).getTime() / 1000
        const timeStr = (new Date(unixTimestamp* 1000)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        console.log(isNaN(timeStr))
        const timeDiff = getTimeDifference(unixTimestamp)
    
        const toggleExpand = () => {
            setExpanded(!expanded);
        };
    
        const formatFoodList = () => {
            if (!foodList || foodList.length === 0) {
                return '';
            }
            return foodList.join(' | ').toUpperCase();
        };
    
        return (
            <Card>
                <CardContent sx={{}}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        {isNaN(timeStr)? <Button>Set Time</Button>
                        :(<Typography>{timeStr}</Typography>)}
                        <Typography fontSize="0.7rem">{ timeDiff>0 && `Coming up in ${timeDiff}`}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "0.5rem" }}>
                        <Typography>{capitalizeEveryWord(mealName)}</Typography>
                    </Box>
                    <Box>
                        <Typography fontSize="0.7rem"> Protein {macros.protein}{uom} | Carbs {macros.carbs}{uom} | Fat {macros.fat}{uom}</Typography>
                        {foodList && (
                            <Typography
                                fontSize="0.7rem"
                                style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
                            >
                                {expanded ? formatFoodList() : `${formatFoodList().slice(0, 55)}`}
                            </Typography>
                        )}
                        {foodList && formatFoodList().length > 55 && (
                            <Box sx={{ marginLeft: '0rem' }}>
                                <Typography
                                    onClick={toggleExpand}
                                    fontSize="0.5rem"
                                    sx={{ cursor: 'pointer', color: 'primary.main' }}
                                >
                                    {expanded ? 'Show less' : 'Show more'}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        );
    }
    


function MiniScheduleCard ({data}) {

    return(
        data.activity_category === "workout" ? (
            <WorkoutCard
                plannedTime={data.planned_on}
                exerciseList={data.exercise_list}
                workoutName={data.activity_name}
            />) : data.activity_category === 'meal' ? (
                <NutritionCard
                    plannedTime={data.planned_}
                    macros={data.macros.data}
                    uom={data.macros.uom}
                    foodList={data.food_list}
                    mealName={data.activity_name}
                />) : null
    )
}

export default MiniScheduleCard