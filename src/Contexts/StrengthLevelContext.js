import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { UserDataContext } from './UserDataContext';
import axiosInstance from '../utils/axiosConfig';
import {calculateAge} from '../utils/utils'

const StrengthLevelContext = createContext();
export const StrengthLevelProvider = ({ children }) => {
    const {userData} = useContext(UserDataContext)
    const [toggleView,setToggleView] = useState(false)
    const [strengthData, setStrengthData] = useState([])
    const [exerciseLogRecords, setExerciseLogRecords] = useState([])
    const [sortedExercises, setSortedExercises] = useState([]);
    


    useEffect(() => {
        const fetchStrengthData = async () => {
            try {
                const response = await axiosInstance.get(`/strength`);
                const data = response.data;
                const groupScores = calcNormalizedScore(data);
                const sortExercises = sortExercisesByStrengthLevel(data);
    
                const sortedGroups = Object.entries(groupScores)
                    .sort((a, b) => b[1] - a[1])
                    .map(([group, score]) => ({
                        group,
                        score,
                        exercises: data[group],
                    }));
    
                setStrengthData(sortedGroups);
                setSortedExercises(sortExercises);
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchStrengthData();
    }, [userData, exerciseLogRecords]);
    
    const getExerciseRecords = async (exerciseName) => {
        try {
            const response = await axiosInstance.get(`/strength/${exerciseName}`);
            const data = response.data;
            setExerciseLogRecords(data)
        } catch (error) {
            console.error(error);
        }
    }

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


    const deleteExercise = async (exerciseName) => {
        // delete all records for selected exercise
        console.log('delete ',exerciseName)
        try {
            const response = await axiosInstance.delete(`/strength/${exerciseName}`);
            const data = response.data;
            console.log('Deleted exercise: ',data)
            setExerciseLogRecords(prev => { 
                const oldData = prev 
                oldData.filter(record => record.exercise_name === data.exercise_deleted)
            })
            setStrengthData(prev => prev.filter(group =>
                group.exercises.every(exercise => exercise.exercise_name !== data.exercise_deleted)
            ));
            return data.exercise_deleted
        } catch (error) {
            console.error(error);
        }

    }

    const updateRecords = async (updatedData, exerciseName) => {
        // delete all records for selected exercise
        console.log('updateRecords function',exerciseName, updatedData, )
        
        const updateUnsavedRows = Object.keys(updatedData.unsavedRows).reduce((acc, rowId) => {
            const row = updatedData.unsavedRows[rowId];
            const age = calculateAge(userData.dob, row.calculated_on);
            acc[rowId] = {
                ...row,
                exercise_name:exerciseName,
                age,
            };
            return acc;
        }, {});
        console.log('updateUnsavedRows',updateUnsavedRows)

        const patchData = {
            ...updatedData,
            unsavedRows: updateUnsavedRows,
            user: {
                gender: userData.gender,
                lift_uom: userData.uom.lift_weight.uom,
                body_mass_uom: userData.uom.body_mass.uom
            }
        };
        console.log('patchData ', patchData)
        try {
            const response = await axiosInstance.patch(`/strength/${exerciseName}`,patchData);
            const data = response.data;
            console.log('updated ',data)
            setExerciseLogRecords(data.log)
            // setStrengthData(prev => prev.filter(group =>
            //     group.exercises.every(exercise => exercise.exercise_name === data.log.exercise_name)
            // ));

        } catch (error) {
            console.error('Patch request failed:', error.response ? error.response.data : error.message);
        }
    }



    return (
        <StrengthLevelContext.Provider
            value={{
                sortedExercises, 
                strengthData, 
                toggleView,
                handleClickExercisesRanked,
                handleClickMuscleGroupRanked,
                getExerciseRecords,
                exerciseLogRecords,
                deleteExercise,
                updateRecords
            }}
        >
            {children}
        </StrengthLevelContext.Provider>
    );
};

export const useStrengthLevelContext = () => useContext(StrengthLevelContext);
