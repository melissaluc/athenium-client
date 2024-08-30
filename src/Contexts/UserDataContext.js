import React, { createContext, useState, useEffect, useMemo} from 'react';
import axiosInstance from '../utils/axiosConfig';

// Create the UserDataContext
export const UserDataContext = createContext();

// Custom provider component
export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // useEffect(()=>{
    //     if(!userData){
    //         setIsAuthenticated(false)
    //     }
    // },[userData])

    const updateUserData = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/user`);
                setUserData(response.data);
                setIsAuthenticated(true)
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('authToken');
                setUserData(null); 
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
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
                setIsAuthenticated(false);
            }
        }
        setLoading(false);
        setIsDataFetched(true);
    };

    useEffect(() => {
        updateUserData();
    }, []);

    const contextValue = useMemo(() => ({
        userData,
        setUserData,
        loading,
        updateUserData,
        updateUser,
        isDataFetched,
        setIsDataFetched,
        isAuthenticated,
        setIsAuthenticated
    }), [userData, loading, isDataFetched, isAuthenticated]);

    return (
        <UserDataContext.Provider value={{ contextValue, userData, setUserData, loading, setLoading, updateUserData, updateUser, isDataFetched, setIsDataFetched, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserDataContext.Provider>
    );
};

