import { Box, Container, Card,CardContent, Button} from "@mui/material"; 
import { useState, useEffect, useContext } from 'react';
import MuscleGroupStrengthCard from "../components/MuscleGroupStrengthCard";
import ExerciseStrengthLevel from "../components/ExerciseStrengthLevel"
import axios from 'axios'
import { UserDataContext } from '../UserDataContext';

function StrengthPage() {
    const {userData, setUserData }= useContext(UserDataContext);
    const base_api_url = process.env.REACT_APP_API_BASE_URL
    const [toggleView,setToggleView] = useState(false)
    const [strengthData, setStrengthData] = useState([])
    const [groupScores, setGroupScores] = useState({})

    // const calculateTotalScoreByGroup = (data) => {
    //     const totalScores = {};
    
    //     // Iterate over each muscle group
    //     Object.keys(data).forEach((group) => {
    //         let groupTotal = 0;
    
 
    //         data[group].forEach((exercise) => {
    //             groupTotal += exercise.score || 0; 
    //         });
    //         totalScores[group] = groupTotal;
    //     });
    
    //     return totalScores;
    // };

    const calcTotalWorkVolumeByGroup = (data) => {
        const totalWorkVolume = {};
    
        // Iterate over each muscle group
        Object.keys(data).forEach((group) => {
            let groupTotal = 0;
    
 
            data[group].forEach((exercise) => {
                groupTotal += exercise.work_volume || 0; 
            });
            totalWorkVolume[group] = groupTotal;
        });

        const sortedEntries = Object.entries(totalWorkVolume).sort((a, b) => b[1] - a[1]);

        // Convert the sorted entries back to an object
        const sortedTotalWorkVolume = Object.fromEntries(sortedEntries);
    
        return sortedTotalWorkVolume;
    
    };


    useEffect(()=>{
        axios.get(`${base_api_url}/strength/${userData.user_id}/`)
        .then(response => {
            setStrengthData(response.data)
             const groupScores = calcTotalWorkVolumeByGroup(response.data)
             setGroupScores(groupScores)
        })
        .catch(error=>console.error(error))
    },[userData])
    

    return (
        <Container>

            <Box sx={{display:'flex', justifyContent:'space-around'}}>
                <Button onClick={()=>{setToggleView(false)}}>Muscle Group Ranking</Button>
                <Button onClick={()=>{setToggleView(true)}}>Exercises Ranked</Button>
            </Box>
         
            {!toggleView ? (
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {Object.entries(strengthData).map(([key, value])=>{
                    
                    return <MuscleGroupStrengthCard key={key} muscleGroup={key} exercises={value} groupScore={groupScores[key]}/>
                
                    })}
                </Box>
                ) : (
                <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                    {Object.values(strengthData)
                    .flat()
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
