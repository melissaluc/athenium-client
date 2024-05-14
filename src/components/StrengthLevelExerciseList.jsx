import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea, CardActions, Button} from "@mui/material";
import ExerciseStrengthLevel from "./ExerciseStrengthLevel";


function StrengthLevelExerciseList ({data}) {
    return (
            <>
                {data.map((exercise)=>{
                    const {
                            date_calculated,
                            exercise_name,
                            body_weight,
                            relative_strength_demographic,
                            relative_strength,
                            one_rep_max,
                            strength,
                            strength_level,
                            next_strength_level,
                            strength_boundaries
                            } = exercise
    
                    return <ExerciseStrengthLevel
                            key={exercise_name}
                            date_calculated={date_calculated}
                            exercise_name={exercise_name}
                            body_weight={body_weight}
                            relative_strength_demographic={relative_strength_demographic}
                            relative_strength={relative_strength}
                            one_rep_max={one_rep_max}
                            strength={strength}
                            strength_level={strength_level}
                            next_strength_level={next_strength_level}
                            strength_boundaries={strength_boundaries}
                            />
                })
                }
            </>

    )
}


export default StrengthLevelExerciseList;