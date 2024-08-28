import React, { createContext, useState, useEffect } from 'react';


const UserSignUpContext = createContext();

const UserSignUpProvider = ({ children }) => {
    const [userFormData, setUserFormData] = useState([]);

    useEffect(() => {
        // Get log from backend
    }, []);

    // CRUD operations
    const addUserSignUp = async (newUserSignUp) => {
        // Handle adding UserSignUp
    };

    const updateUserSignUp = async (updatedUserSignUp) => {
        // Handle updating UserSignUp
    };

    const deleteUserSignUp = async (id) => {
        // Handle deleting UserSignUp
    };

    return (
        <UserSignUpContext.Provider value={{ userFormData,addUserSignUp, updateUserSignUp, deleteUserSignUp }}>
            {children}
        </UserSignUpContext.Provider>
    );
};

export { UserSignUpContext, UserSignUpProvider };
