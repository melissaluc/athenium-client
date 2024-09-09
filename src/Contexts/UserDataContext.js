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

    useEffect(()=>{
        console.log(userData)
    },[userData])

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

    const updateUserSettings = async (settingsData) => {
            const sendData = {
                country: settingsData.country,
                dob: settingsData.dob.toISOString().split('T')[0],
                first_name:settingsData.first_name,
                last_name:settingsData.last_name,
                uom:settingsData.uom
            }
            try {
                console.log('settingsData: ',settingsData)
                const response = await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/user/settings`, sendData);
                console.log('Setting response: ',response.data)
                setUserData(response.data);
            } catch (error) {
                console.error(error)
            }
        
    };

    useEffect(() => {
        updateUserData();
    }, []);

    const contextValue = useMemo(() => ({
        userData,
        setUserData,
        loading,
        updateUserData,
        updateUserSettings,
        isDataFetched,
        setIsDataFetched,
        isAuthenticated,
        setIsAuthenticated
    }), [userData, loading, isDataFetched, isAuthenticated]);

    return (
        <UserDataContext.Provider value={{ contextValue, userData, setUserData, loading, setLoading, updateUserData, updateUserSettings, isDataFetched, setIsDataFetched, isAuthenticated, setIsAuthenticated,  }}>
            {children}
        </UserDataContext.Provider>
    );
};

