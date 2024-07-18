import { createContext, useState, useEffect } from 'react';
import axios from 'axios';


// Create a context with initial empty user data
export const UserDataContext = createContext();

// Custom provider component to manage state
export const UserDataProvider = ({ children }) => {
    const base_api_url = process.env.REACT_APP_API_BASE_URL
    const [username, setUsername] = useState('')
    const [userData, setUserData] = useState({
        user_id: null,
        first_name:null,
        last_name:null,
        age: null,
        weight:null,
        height:`5'9"`
    });


    useEffect(()=>{
        axios.get(`${base_api_url}/user/39b17fed-61d6-492a-b528-4507290d5423/`)
        .then((response)=>{
            setUserData(prev => ({
                ...prev,
                ...response.data
            }))
        })
        .catch(error => console.error(error))
    },[])

    return (
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};