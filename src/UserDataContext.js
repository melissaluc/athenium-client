import { createContext, useState, useEffect } from 'react';
import axiosInstance from './utils/axiosConfig'


// Create a context with initial empty user data
export const UserDataContext = createContext();

// Custom provider component to manage state
export const UserDataProvider = ({ children }) => {

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [userData, setUserData] = useState({
        first_name:null,
        last_name:null,
        age: null,
        weight:null,
        height_cm:null,
    });


    useEffect(()=>{
        if (!isDataFetched){

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
    },[isDataFetched])

    return (
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};