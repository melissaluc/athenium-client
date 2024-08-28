import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { UserDataContext } from './UserDataContext';
import axiosInstance from '../utils/axiosConfig';
import { v4 as uuidv4 } from 'uuid';
import { RestorePageOutlined } from '@mui/icons-material';

const WorkoutContext = createContext();
export const WorkoutProvider = ({ children }) => {
    //  Lift mass is stored in db as lbs, 
    // use UserData to send data to strengthCalc
    //  Convert lift mass back to lbs or user preferred uom
    const {userData} = useContext(UserDataContext)
    const [workoutListData,  setWorkoutListData] = useState([]);
    const [activeWorkoutData, setActiveWorkoutData] = useState({});
    const [workoutData, setWorkoutData] = useState({});
    const [activeViewWorkoutData, setActiveViewWorkoutData] = useState([]);
    const [activeViewExerciseData, setActiveViewExerciseData] = useState([]);
    const [workoutMode, setWorkoutMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [addedExercises, setAddedExercises] = useState({})
    const [updatedExercises, setUpdatedExercises] = useState({})
    const [deletedExercises, setDeletedExercises] = useState([])
    const [isFiltered, setIsFiltered] = useState(false);

    useEffect(()=>{
        axiosInstance.get(`/workouts`)
        .then(response =>{
            setActiveViewWorkoutData(response.data)
             setWorkoutListData(response.data)
             setDeletedExercises([])
             setAddedExercises({})
             setUpdatedExercises({})
        })
        .catch(error=>console.error(error))
        console.log(workoutListData)
    },[])

    const getWorkoutById = useCallback(async (workout_id) => {

        try {
            console.log('Fetching workout data for: ', workout_id)
            const response = await axiosInstance.get(`/workouts/${workout_id}`);
            console.log('workout data: ', response.data[0]);
            setActiveWorkoutData(response.data[0]);
            setWorkoutData(response.data[0]);
        } catch (error) {
            console.error('Error fetching workout:', error);
        }
    }, []);

    const calculateStrengthLevel = useCallback(async (exercise_name, weight, sets, reps) => {
        const data = {
            body_weight: userData.weight,
            age: userData.age,
            gender: userData.gender,
            weight,
            reps,
            exercise_name,
            lift_uom: userData.uom.lift_weight.uom,
            body_mass_uom: userData.uom.body_mass.uom
        };
        console.log('data to pass to calc: ',data)
        try {
            const response = await axiosInstance.post('/strength', data);
            return { result: response.data[0], error: null };
        } catch (error) {
            console.error('Error calculating strength level:', error);
            return { result: null, error: true };
        }
    }, [userData]);


    const handleStart = () => {
        //  User click start  button in workouts/workout_id to enter workout mode
        setWorkoutMode(true);
        setEditMode(false);
    };

    const handleCancel = () => {
        setWorkoutMode(false);
        setAddedExercises({})
        setDeletedExercises([])

        // Optionally reset state or undo changes
    };

  

    const updateWorkout = (newWorkoutDetails) => {
        const {exercises,...rest} = newWorkoutDetails
        const patchData = {
            updatedWorkoutDetails: rest || {},
            addedExercises: addedExercises || {},
            deletedExercises: deletedExercises || [],
            updatedExercises: updatedExercises || {},
        }
        
        axiosInstance.patch(`/workouts/${activeWorkoutData.workout_id}`,patchData)
        .then(response =>{

            if (response.status === 200) {
                console.log(response.workout)
                setDeletedExercises([])
                setAddedExercises({})
                setUpdatedExercises({})
                setActiveWorkoutData(prev => {
                    const updatedData = {
                                    ...prev,
                                    ...newWorkoutDetails
                                }
                    setWorkoutData(updatedData)
                    return updatedData
                })
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        })
        .catch(error=>console.error(error))
    };

    const updateWorkoutDetails = (newDetails) => {
        setActiveWorkoutData(prev=>({...prev, newDetails}))
    }

    const deleteWorkout = async (workoutId) => {
        try {
            const response = await axiosInstance.delete(`/workouts/${workoutId}`);
            
            if (response.status === 204) {
                const updatedWorkouts = workoutListData.filter(workout => workout.workout_id !== workoutId);
                setWorkoutListData(updatedWorkouts);
                setActiveViewWorkoutData(updatedWorkouts);
            } else {
                console.error('Failed to delete workout:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting workout:', error);
        }
    };
    
    const addWorkout = useCallback(async (newWorkout) => {
        try {
            const { workout_name, description } = newWorkout;
            const postData = {
                workout_name,
                description,
                exercises: [],
                last_completed: null,
                frequency: 0,
            };
            const response = await axiosInstance.post('/workouts', postData);
            console.log(response)
            // response.status ===
            const updatedWorkout = { ...response.data, exercises: [] };
            setWorkoutListData(prev => [updatedWorkout, ...prev]);
            setActiveViewWorkoutData(prev => [updatedWorkout, ...prev]);
        } catch (error) {
            console.error('Error adding workout:', error);
        }
    }, []);


    const updateExercise = (exerciseId, exercise) => {
        // Check if the exercise is in the addedExercises
        if (addedExercises[exerciseId]) {
            setAddedExercises(prev => ({
                ...prev,
                [exerciseId]: {
                    ...prev[exerciseId], 
                    ...exercise          
                }
            }));
        } else {
            setUpdatedExercises(prev => ({
                ...prev,
                [exerciseId]: {
                    ...prev[exerciseId], 
                    ...exercise      
                }
            }));
        }
    }
    

    

    const deleteExercise = (exerciseId) => {
        // Not permanent
        const updatedExercises = activeWorkoutData.exercises.filter(exercise => exercise.id !== exerciseId);

        setAddedExercises(prev => {
            const { [exerciseId]: removed, ...remaining } = prev;
            return remaining;
        });
    
        setUpdatedExercises(prev => {
            const { [exerciseId]: removed, ...remaining } = prev;
            return remaining;
        });
        setActiveWorkoutData(prev => ({
            ...prev,
            exercises: updatedExercises
          }));
          console.log('deleted exercise: ',exerciseId)
        setDeletedExercises(prev => [...prev, exerciseId]);
    };

    const addExercise = (exercise) => {
        const {exerciseName: exercise_name, group, imgURL:img_url } = exercise;
        const id = uuidv4()
        const newExercise = {
            id,
            category: "strength",
            group,
            exercise_name,
            weight: 0,
            reps: 0,
            sets: 0,
            img_url
        };
        
        setActiveWorkoutData(prev => ({
            ...prev,
            exercises: [...(prev.exercises || []), newExercise]
        }));
        console.log('added exercise:',exercise_name)

        setAddedExercises(prev => ({
            ...prev,
            [id]: newExercise
        }));
    };


    //  Helper function
    const onSort = (order, category) => {
        handleSort(order, category)
    }
    const handleSort = (order, category) => {
        const sortedData = [...workoutListData].sort((a, b) => {
            if (category === 'workout_name') {
                // String comparison
                return order === 'asc' ? a[category].localeCompare(b[category]) : b[category].localeCompare(a[category]);
            } else {
                // Numerical comparison
                return order === 'asc' ? a[category] - b[category] : b[category] - a[category];
            }
        });
        console.log('Sort Data ' , sortedData);
         setWorkoutListData(sortedData);
         setWorkoutListData(sortedData);
    };

    

    const onFilter = (filterText) => {
        if (!filterText) {
             setWorkoutListData(workoutListData);
        } else {
            handleFilter(filterText)
        }
    }

    const handleFilter = (filterCriteria) => {
        const filteredData = workoutListData.filter(item => item.workout_name === filterCriteria)
         setWorkoutListData(filteredData);
    };

    return (
        <WorkoutContext.Provider
            value={{
                onSort,
                onFilter,
                workoutListData,
                 setWorkoutListData,
                activeViewWorkoutData,
                setActiveViewWorkoutData,
                activeViewExerciseData,
                setActiveViewExerciseData,
                workoutMode,
                setWorkoutMode,
                editMode,
                setEditMode,
                handleStart,
                handleCancel,
                updateWorkout,
                deleteWorkout,
                addWorkout,
                updateExercise,
                deleteExercise,
                addExercise,
                getWorkoutById,
                activeWorkoutData,
                setActiveWorkoutData,
                calculateStrengthLevel,
                updateWorkoutDetails
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkoutContext = () => useContext(WorkoutContext);
