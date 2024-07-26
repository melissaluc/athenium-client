import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


// Create a context with initial empty user data
export const UserDataContext = createContext();

// Custom provider component to manage state
export const UserDataProvider = ({ children }) => {
    const base_api_url = process.env.REACT_APP_API_BASE_URL
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [username, setUsername] = useState('admin')
    const [userData, setUserData] = useState({
        user_id: null,
        first_name:null,
        last_name:null,
        age: null,
        weight:null,
        height_cm:null,
    });


    useEffect(()=>{
        if (!isDataFetched){
            axios.get(`${base_api_url}/user/${username}`)
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