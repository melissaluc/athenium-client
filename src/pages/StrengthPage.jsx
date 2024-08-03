import { Box, Container, Card,CardContent, Button, Typography} from "@mui/material"; 
import { useState, useEffect, useContext } from 'react';
import MuscleGroupStrengthCard from "../components/MuscleGroupStrengthCard";
import ExerciseStrengthLevel from "../components/ExerciseStrengthLevel"
import axiosInstance from "../utils/axiosConfig";

function StrengthPage() {
    const [toggleView,setToggleView] = useState(false)
    const [strengthData, setStrengthData] = useState([])
    const [sortedExercises, setSortedExercises] = useState([]);


    const calcNormalizedScore = (data) => {

        const groupScore = {};

        let maxCountGroupExercises = 0;

        Object.keys(data).forEach((group) => {
            const exercises = data[group];
            const numGroupExercises = exercises.length;
    
            if (numGroupExercises > maxCountGroupExercises) {
                maxCountGroupExercises = numGroupExercises;
            }

            let groupTotal = 0;
            exercises.forEach((exercise) => {
                groupTotal += exercise.score || 0;
            });
    
            groupScore[group] = groupTotal / numGroupExercises;
        });
    
        // Normalize the scores based on the number of exercises
        const normalizedScores = {};
        Object.keys(groupScore).forEach((group) => {
            const normalizationFactor = data[group].length/maxCountGroupExercises;
            normalizedScores[group] = (groupScore[group] * normalizationFactor).toFixed(2);
        });


        return normalizedScores 
    };

    const sortExercisesByStrengthLevel = (data) => {
        // Flatten the exercises and sort them by strength_level
        const exercisesArray = Object.values(data).flat();
        return exercisesArray.sort((a, b) => b.score - a.score);
    };

    const handleClickMuscleGroupRanked = () => {
        // Normalize the scores actual/maxscore 
        setToggleView(false)
        
    }
    
    const handleClickExercisesRanked = () => {
        // Sort exercises by strengthLevel
        setToggleView(true)
    }


    useEffect(()=>{
        axiosInstance.get(`/strength`)
        .then(response => {
            const data = response.data
            const groupScores = calcNormalizedScore(data)
            const sortExercises = sortExercisesByStrengthLevel(data)

            const sortedGroups = Object.entries(groupScores)
                .sort((a, b) => b[1] - a[1])
                .map(([group, score]) => ({
                    group,
                    score,
                    exercises: data[group],
                }));

            setStrengthData(sortedGroups);
            setSortedExercises(sortExercises)

        })
        .catch(error=>console.error(error))
    },[])
    

    return (
        <Container>

            <Box sx={{display:'flex', justifyContent:'space-around'}}>
                <Button onClick={handleClickMuscleGroupRanked}>Muscle Group Ranking</Button>
                <Button onClick={handleClickExercisesRanked}>Exercises Ranked</Button>
            </Box>
         
            {!toggleView ? (
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {strengthData.map((group)=>{
                        return <MuscleGroupStrengthCard key={group.group} muscleGroup={group.group} exercises={group.exercises} groupScore={group.score}/>
                    })}
                </Box>
                ) : (
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {sortedExercises
                    .map((exercise) => {
                        const {
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
                            img_url
                            } = exercise
                        return (
                        <Card>
                            <CardContent>
                                <ExerciseStrengthLevel
                                        key={exercise_name}
                                        date_calculated={date_calculated}
                                        exercise_name={exercise_name}
                                        group={group}
                                        body_weight={body_weight}
                                        relative_strength_demographic={relative_strength_demographic}
                                        one_rep_max={one_rep_max}
                                        reps={reps}
                                        lift={lift}
                                        strength_level={strength_level}
                                        next_strength_level={next_strength_level}
                                        strength_bounds={strength_bounds}
                                        score={score}
                                        img_url={img_url}
                                        view={toggleView}
                                        />
                            </CardContent>
                        </Card>
                    )
                    })}
                </Box>
            )
            }
        
        </Container>
    );
}

export default StrengthPage;
