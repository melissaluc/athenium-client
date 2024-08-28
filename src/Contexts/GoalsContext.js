import React, { createContext, useState, useEffect } from 'react';

// Create context
const GoalsContext = createContext();

// Create provider component
const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState([]);
 

 
    useEffect(() => {
        // Get goals
    }, []);

    // Add a new goal
    const addGoal = async (newGoal) => {

    };

    // Update an existing goal
    const updateGoal = async (updatedGoal) => {

    };

    // Delete a goal
    const deleteGoal = async (id) => {

    };

    return (
        <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal}}>
            {children}
        </GoalsContext.Provider>
    );
};

export { GoalsContext, GoalsProvider };
