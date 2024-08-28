import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';

// Create the UserDataContext
export const UserDataContext = createContext();

// Custom provider component
export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const updateUserData = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/user`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('authToken');
                setUserData(null); 
            }
        }
        setLoading(false);
        setIsDataFetched(true);
    };

    const updateUser = async (settingsData) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/user`, settingsData);
                setUserData(response.data);
            } catch (error) {
                console.error('Error updating user data:', error);
                localStorage.removeItem('authToken');
                setUserData(null);
            }
        }
        setLoading(false);
        setIsDataFetched(true);
    };

    useEffect(() => {
        updateUserData();
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, setUserData, loading, updateUserData, updateUser, isDataFetched, setIsDataFetched }}>
            {children}
        </UserDataContext.Provider>
    );
};

