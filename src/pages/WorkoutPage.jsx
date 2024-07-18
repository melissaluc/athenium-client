import { Box, Container } from "@mui/material"; 
import SwapVertIcon from '@mui/icons-material/SwapVert';
import TuneIcon from '@mui/icons-material/Tune';
import SortPopover from "../components/Popovers/SortPopover";
import FilterPopover from "../components/Popovers/FilterPopover"
import WorkoutCard from "../components/Cards/WorkoutCard/WorkoutCard";
import WorkoutModal from "../components/Modals/WorkoutModal"
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

import {useState, useEffect} from 'react'


function WorkoutPage(){
    const [originalWorkoutData, setOriginalWorkoutData] = useState([]);
    const [workoutData, setWorkoutData] = useState([])
    const [addedExercises, setAddedExercises] = useState([])
    const [deletedExercises, setDeletedExercises] = useState([])
    const [updatedExercises, setUpdatedExercises] = useState([])
    const base_api_url = process.env.REACT_APP_API_BASE_URL

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
        console.log('Sort Data ' , sortedData);
        setWorkoutData(sortedData);
        setOriginalWorkoutData(sortedData);
    };

    const handleUpdateData = (data) =>{

        const updatedData = originalWorkoutData.map(workout=>{
            if (workout.workout_id === data.workout_id) {
                const newData =  {
                    ...workout,
                    workout_name: data.workout_name,
                    description: data.description,
                    exercises: data.exercises
                }

  

                return newData
            }
            return workout
            }
        )
        console.log('Workout updated ',updatedData)
        setOriginalWorkoutData(updatedData)
    }

    const handleAddWorkout = (newWorkout) => {

        const {description, tags, workout_name, workout_id} = newWorkout
        
        setOriginalWorkoutData([newWorkout,...originalWorkoutData])
        setWorkoutData([newWorkout,...workoutData])
        console.log('new workout ', newWorkout)
        const postData = {
            workout_id,
            workout_name,
            description,
            exercises:[],
            last_completed:null,
            // frequency:workout.frequency,
            tags: tags ? tags : null 
        }
        axios.post(`${base_api_url}/workouts/39b17fed-61d6-492a-b528-4507290d5423`,postData)
            .then(response=>{
                console.log(response)
            })
    }
    
    const handleDeleteWorkout = (workout_id) => {
        // Filter out workout from originalWorkoutData
        const updatedOriginalData = originalWorkoutData.filter(workout => workout.workout_id !== workout_id);
        setOriginalWorkoutData(updatedOriginalData);
    
        // Filter out workout from workoutData
        const updatedData = workoutData.filter(workout => workout.workout_id !== workout_id);
        setWorkoutData(updatedData);
    
        // DELETE request to backend
        axios.delete(`${base_api_url}/workouts/39b17fed-61d6-492a-b528-4507290d5423/${workout_id}`)
            .then(response => {
                console.log(response);
                // Handle success or further updates if needed
            })
            .catch(error => {
                console.error('Error deleting workout:', error);
                // Handle error if needed
            });
    };

    const handleDeleteExercise = (data) => {

        const updatedData = originalWorkoutData.map(workout=>{
            if (workout.workout_id === data.workout_id) {
                const newDeleteExercise = {
                    ...workout,
                    exercises: workout.exercises.filter(exercise => exercise.id !== data.id)
                }
                return newDeleteExercise
            }
            return workout
        })

        setWorkoutData(updatedData)
        setOriginalWorkoutData(updatedData)
        
        setDeletedExercises(prev => [...prev, data.id]);

    }

    const handleAddTag = ()=>{
        alert('add tag')
    }

    

    const handleAddExercise = (exercise) => {
        const { workout_id, exerciseName: exercise_name, group, imgURL:img_url } = exercise;

        const newExercise = {
            id: uuidv4(),
            img_url: null,
            category: "strength",
            group,
            exercise_name,
            weight: 0,
            reps: 0,
            sets: 0,
            img_url
        };
    

        const updatedData = originalWorkoutData.map(workout => {
            if (workout.workout_id === workout_id) {
                // Filter out deleted exercises from workout.exercises
                const filteredExercises = workout.exercises.filter(exercise => !deletedExercises.includes(exercise.id));
    
                return {
                    ...workout,
                    exercises: [...filteredExercises, newExercise]
                };
            }
            return workout;
        });
    

    setOriginalWorkoutData(updatedData);
    setWorkoutData(updatedData);
    setAddedExercises(prev => [...prev, newExercise]);

    };
    

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

    const getUserWorkoutData = () => {
        axios.get(`${base_api_url}/workouts/39b17fed-61d6-492a-b528-4507290d5423`)
        .then(response =>{
            setOriginalWorkoutData(response.data)
            setWorkoutData(response.data)
        })
        .catch(error=>console.error(error))

    }

    useEffect(()=>{
        getUserWorkoutData()
    },[])
    

    return (
        <Container>
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
                            handleDeleteWorkout={handleDeleteWorkout }
                            setUpdatedExercises={setUpdatedExercises}
                            addedExercises={addedExercises} 
                            setAddedExercises={setAddedExercises}
                            deletedExercises={deletedExercises} 
                            setDeletedExercises={setDeletedExercises}
                            updatedExercises={updatedExercises} />
                })}
            </Box>
        </Container>
    )

}

export default WorkoutPage;