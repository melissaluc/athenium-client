import { Box, Container, Typography, LinearProgress, Card,CardContent, CardActionArea, CardActions, Button} from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import strengthLevelData from "../data/strength.json";
import { useState } from 'react';
import MuscleGroupStrengthCard from "../components/MuscleGroupStrengthCard";
import ExerciseStrengthLevel from "../components/ExerciseStrengthLevel"


function StrengthPage() {

    const [toggleView,setToggleView] = useState(false)
    


    return (
        <Container>
            {/* Header + Nav */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Strength</Typography>
                <DrawerNavBar />
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-around'}}>
                <Button onClick={()=>{setToggleView(false)}}>Muscle Group Ranking</Button>
                <Button onClick={()=>{setToggleView(true)}}>Exercises Ranked</Button>
            </Box>
         
            {!toggleView ? (
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {Object.entries(strengthLevelData.muscle_groups).map(([key, value])=>{
                    console.log("key",key)
                    return <MuscleGroupStrengthCard key={key} muscleGroup={key} exercises={value} />
                
                    })}
                </Box>
                ) : (
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {Object.values(strengthLevelData.muscle_groups)
                    .flat()
                    .map((exercise) => {
                        const {
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
                            strength_boundaries
                            } = exercise
                        return (
                        <Card>
                            <CardContent>
                                <ExerciseStrengthLevel
                                        key={exercise_name}
                                        date_calculated={date_calculated}
                                        exercise_name={exercise_name}
                                        category={category}
                                        body_weight={body_weight}
                                        relative_strength_demographic={relative_strength_demographic}
                                        relative_strength={relative_strength}
                                        one_rep_max={one_rep_max}
                                        strength={strength}
                                        strength_level={strength_level}
                                        next_strength_level={next_strength_level}
                                        strength_boundaries={strength_boundaries}
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
