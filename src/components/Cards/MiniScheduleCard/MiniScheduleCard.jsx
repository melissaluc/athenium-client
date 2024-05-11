import { Button, Typography, Container, Box, Card, CardContent, CardHeader, CardActionArea, CardActions } from '@mui/material';
import {useState} from 'react'

import {
    FitnessCenterOutlined,
    DirectionsRunOutlined,
    PoolOutlined,
    HikingOutlined,
    DirectionsWalkOutlined,
    SportsMartialArtsOutlined,
    SportsHandballOutlined,
    SelfImprovementOutlined,
    RestaurantOutlined,
    BakeryDiningOutlined
} from '@mui/icons-material'


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


function getIcon(subcategory) {
    switch (subcategory) {
        case 'weights':
            return <FitnessCenterOutlined />;
        case 'mat':
            return <SelfImprovementOutlined />;
        case 'sports':
            return <SportsHandballOutlined />;
        case 'martial arts':
            return <SportsMartialArtsOutlined />;
        case 'running':
            return <DirectionsRunOutlined />;
        case 'swimming':
            return <PoolOutlined />;
        case 'hiking':
            return <HikingOutlined />;
        case 'walking':
            return <DirectionsWalkOutlined />;
        case 'meal':
            return <RestaurantOutlined/>;
        case 'snack':
            return <BakeryDiningOutlined/>;
        default:
        return null;
    }
    }

function WorkoutCard ({plannedTime,timeStr,exerciseList, workoutName, subcategory}) {
    const [expanded, setExpanded] = useState(false);

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
                <Typography fontSize="0.7rem">Coming up in {getTimeDifference(plannedTime)}</Typography>
            </Box>
            <Box sx={{display:"flex", gap:"0.5rem"}}>
                {getIcon(subcategory)}
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


    function NutritionCard({ plannedTime, timeStr, macros, uom, foodList, mealName, subcategory }) {
        const [expanded, setExpanded] = useState(false);
    
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
                        <Typography>{timeStr}</Typography>
                        <Typography fontSize="0.7rem">Coming up in {getTimeDifference(plannedTime)}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "0.5rem" }}>
                        {getIcon(subcategory)}
                        <Typography>{mealName}</Typography>
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
    const timeStr = (new Date(data.planned_time* 1000)).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

    return(
        // <></>
        data.activity_category === "workout" ? (
            <WorkoutCard
                plannedTime={data.planned_time}
                timeStr={timeStr}
                exerciseList={data.exercise_list}
                workoutName={data.activity_name}
                subcategory={data.activity_subcategory}
            />) : data.activity_category === 'nutrition' ? (
                <NutritionCard
                    plannedTime={data.planned_time}
                    timeStr={timeStr}
                    macros={data.macros.data}
                    uom={data.macros.uom}
                    foodList={data.food_list}
                    mealName={data.activity_name}
                    subcategory={data.activity_subcategory}
                />) : null
    )
}

export default MiniScheduleCard