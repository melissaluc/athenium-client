import { createContext, useState, useEffect } from 'react';
import axiosInstance from './utils/axiosConfig'


// Create a context with initial empty user data
export const UserDataContext = createContext();

// Custom provider component to manage state
export const UserDataProvider = ({ children }) => {

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [userData, setUserData] = useState({});
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setHasToken(!!token);
    }, []);

    useEffect(()=>{
        if (hasToken && !isDataFetched){

            axiosInstance.get(`/user`)
            .then((response)=>{
                setUserData(prev => ({
                    ...prev,
                    ...response.data
                }))
                setIsDataFetched(true)
                console.log('userdata ',response.data)
            })
            .catch(error => console.error(error))

        }
    },[isDataFetched, hasToken])

    const updateUserData = async (callback) => {
        if (hasToken) {
            try {
                const response = await axiosInstance.get('/user');
                setUserData(response.data);
                callback && callback();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <UserDataContext.Provider value={{ userData, setUserData, setIsDataFetched, updateUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};