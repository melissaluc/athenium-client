import { createContext, useState, useEffect } from 'react';
import axiosInstance from './utils/axiosConfig'


// Create a context with initial empty user data
export const UserDataContext = createContext();

// Custom provider component to manage state
export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isDataFetched, setIsDataFetched] = useState(false)
    const updateUserData = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
        setIsDataFetched(true);
    };

    useEffect(() => {
        updateUserData();
    }, []);


    

    return (
        <UserDataContext.Provider value={{ userData, setUserData, loading, updateUserData, isDataFetched, setIsDataFetched }}>
            {children}
        </UserDataContext.Provider>
    );
};