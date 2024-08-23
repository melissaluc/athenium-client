import { createContext, useState, useEffect } from 'react';
import axiosInstance from './utils/axiosConfig'


// Create a context with initial empty user data
export const UserDataContext = createContext();

// Custom provider component to manage state
export const UserDataProvider = ({ children }) => {

    const [isDataFetched, setIsDataFetched] = useState(false);
    const [userData, setUserData] = useState({});
    const [hasToken, setHasToken] = useState(false);

    const updateUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const response = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        updateUserData();
    }, []);

    // useEffect(() => {
    //     const token = localStorage.getItem('authToken');
    //     setHasToken(!!token);
    // }, []);

    // useEffect(()=>{
    //     if (hasToken && !isDataFetched){

    //         axiosInstance.get(`/user`)
    //         .then((response)=>{
    //             setUserData(prev => ({
    //                 ...prev,
    //                 ...response.data
    //             }))
    //             setIsDataFetched(true)
    //             console.log('userdata ',response.data)
    //         })
    //         .catch(error => console.error(error))

    //     }
    // },[isDataFetched, hasToken])

    // const updateUserData = async (callback) => {
    //     if (hasToken) {
    //         try {
    //             const response = await axiosInstance.get('/user');
    //             setUserData(response.data);
    //             if (callback) callback();
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // };
    

    return (
        <UserDataContext.Provider value={{ userData, setUserData, setIsDataFetched, updateUserData }}>
            {children}
        </UserDataContext.Provider>
    );
};