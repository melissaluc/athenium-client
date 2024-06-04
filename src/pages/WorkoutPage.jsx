import { Box, Container, Typography } from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import TuneIcon from '@mui/icons-material/Tune';
import SortPopover from "../components/Popovers/SortPopover";
import FilterPopover from "../components/Popovers/FilterPopover"
import WorkoutCard from "../components/Cards/WorkoutCard/WorkoutCard";
import WorkoutModal from "../components/Modals/WorkoutModal"

import workoutLogData from "../data/workouts.json"


import {useState, useEffect} from 'react'


function WorkoutPage({}){
    const [originalWorkoutData, setOriginalWorkoutData] = useState(workoutLogData.workouts_log);
    const [workoutData, setWorkoutData] = useState(workoutLogData.workouts_log)
    
    useEffect(() => {
        setWorkoutData(originalWorkoutData);
    }, [originalWorkoutData]);

    const onSort = (order, category) => {
        handleSort(order, category)
    }
    const handleSort = (order, category) => {
        const sortedData = [...workoutData].sort((a, b) => {
            if (category === 'workout_name') {
                // String comparison
                return order === 'asc' ? a[category].localeCompare(b[category]) : b[category].localeCompare(a[category]);
            } else {
                // Numerical comparison
                return order === 'asc' ? a[category] - b[category] : b[category] - a[category];
            }
        });
        console.log(sortedData);
        setWorkoutData(sortedData);
    };

    const handleUpdateData = (data) =>{
        console.log(data)
        // update database datasend to backend
    }
    const handleAddWorkout = (newWorkout) => {
        const updatedWorkouts = [newWorkout,...originalWorkoutData];
        setOriginalWorkoutData(updatedWorkouts)
    }

    const handleDeleteWorkout = (workout_id) => {
        const updatedData = originalWorkoutData.filter(workout=> workout.workout_id !== workout_id)
        console.log(updatedData)
        setOriginalWorkoutData(updatedData)
    }

    const handleDeleteExercise = (data) => {
        const updatedData = originalWorkoutData.map(workout=>{
            console.log('map',workout)
            if (workout.workout_id === data.workout_id) {
                return {
                    ...workout,
                    exercises: workout.exercises.filter(exercise => exercise.id !== data.id)
                }
            }
            return workout
            }
        )
        console.log(updatedData)
        setOriginalWorkoutData(updatedData)
    }

    const handleAddTag = ()=>{
        alert('add tag')
    }

    

    const handleAddExercise = (exercise)=>{
        const {workout_id, exercise_name, group} = exercise
        const updatedData = originalWorkoutData.map((workout)=>{
            if(workout.workout_id === workout_id) {
                workout.exercises.push(
                    {
                        id:Date.now(),
                        "img_url":null,
                        "category":"strength",
                        group,
                        exercise_name,
                        "weight":0,
                        "reps":0,
                        "sets":0
                    }
                
                )
            } return workout
        })
        setOriginalWorkoutData(updatedData)
    }


    const onFilter = (filterText) => {
        if (!filterText) {
            setWorkoutData(originalWorkoutData);
        } else {
            handleFilter(filterText)
        }
    }

    const handleFilter = (filterCriteria) => {
        const filteredData = workoutData.filter(item => item.workout_name === filterCriteria)
        setWorkoutData(filteredData);
    };
    

    return (
        <Container>
            {/* Header + Nav */}
            <Box sx={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                <DrawerNavBar/>
            </Box>
            <Box sx={{display:'flex', justifyContent:'center'}}>
                <WorkoutModal action={'add'} handleAddWorkout={handleAddWorkout}/>
            </Box>

            {/* Filter + sort */}
            <Box sx={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                <FilterPopover buttonDisplay={<TuneIcon/>} data={workoutData} onFilter={onFilter}/>
                <SortPopover buttonDisplay={<SwapVertIcon/>} onSort={onSort}/>
            </Box>


            {/* Workout cards */}
            <Box sx={{display:'flex', flexDirection:'column', gap:"1rem"}}>
                {workoutData.map((data)=>{
                    return <WorkoutCard 
                            key={data.workout_id} 
                            data={data} 
                            handleAddTag ={handleAddTag} 
                            handleAddExercise={handleAddExercise} 
                            handleDeleteExercise={handleDeleteExercise}
                            handleUpdateData={handleUpdateData}
                            handleDeleteWorkout={handleDeleteWorkout }/>
                })}
            </Box>
        </Container>
    )

}

export default WorkoutPage;