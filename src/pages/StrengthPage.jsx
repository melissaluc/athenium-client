import { Box, Container, Card,CardContent, Button, Typography, ButtonGroup} from "@mui/material"; 
import { useState, useEffect, useContext } from 'react';
import MuscleGroupStrengthCard from "../components/MuscleGroupStrengthCard";
import ExerciseStrengthLevel from "../components/ExerciseStrengthLevel"
import { useStrengthLevelContext } from "../Contexts/StrengthLevelContext";
import { useLocation } from "react-router-dom";

function StrengthPage() {
    const {sortedExercises, strengthData, toggleView, handleClickExercisesRanked, handleClickMuscleGroupRanked} = useStrengthLevelContext()
    const location = useLocation();

    useEffect(() => {
        // Check if there is state from the previous page
        console.log(location.view)
        if (location.state?.view && strengthData && sortedExercises) {
            handleClickExercisesRanked();
        } else {
            handleClickMuscleGroupRanked()
        }
    }, [location.state?.view, strengthData, sortedExercises]);

    return (
        <Container>

            <ButtonGroup sx={{display:'flex', justifyContent:'space-around'}}>
                <Button variant='text' onClick={handleClickMuscleGroupRanked}>Groups</Button>
                <Button variant='text' onClick={handleClickExercisesRanked}>Exercises</Button>
            </ButtonGroup>
         
            {!toggleView ? (
                <Box sx={{display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center'}}>
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
