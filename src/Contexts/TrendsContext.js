import React, { createContext, useContext,  useState, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import axiosInstance from '../utils/axiosConfig';
// Create context
const TrendsContext = createContext();

// Create provider component
const TrendsProvider = ({ children }) => {
    const {userData} = useContext(UserDataContext)
    const [selectDateRange, setSelectDateRange] = useState({});
    const [data,setData] = useState({});
    const [activeData, setActiveData] = useState([]);
    const [activeView, setActiveView] = useState('month');
    
    // useEffect(()=>{
    //   handleView(activeView)
    // },[activeView])
  
    useEffect(()=>{
      // get year data initially
      axiosInstance.get(`/trends`)
      .then(response =>{
        console.log('api data: ',response.data)
        setActiveData(response.data)
        setData(response.data)
  
      })
      .catch(error=>console.error(error))
    },[userData])

 
    useEffect(() => {
        // Get trend data
    }, []);

    // Filter trend data



    return (
        <TrendsContext.Provider value={{activeData, activeView}}>
            {children}
        </TrendsContext.Provider>
    );
};

export { TrendsContext, TrendsProvider };
