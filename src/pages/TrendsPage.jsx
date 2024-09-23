import { Box, Container, Button, Tabs } from "@mui/material"; 
import {TabContext, TabPanel, TabList} from '@mui/lab';
import { useState, useEffect, useContext } from 'react';
import DateRangePickerModal from "../components/Modals/DateRangePickerModal";
import TrendsGroup from "../components/TrendsGroup";
import { useTheme } from "@emotion/react";
import { startOfWeek, endOfWeek, startOfMonth,endOfMonth, startOfYear, endOfYear, format } from 'date-fns';
import axiosInstance from "../utils/axiosConfig";
import { UserDataContext } from '../Contexts/UserDataContext';

const getWeekRange = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sun
  const end = endOfWeek(start, { weekStartsOn: 0 }); // Sat
  return { start, end };
};

const getMonthRange = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(start);
  return { start, end };
};

const getYearRange = (date) => {
  const start = startOfYear(date);
  const end = endOfYear(start);
  return { start, end };
};

function TrendsPage() {
  const {userData, setUserData }= useContext(UserDataContext);
  const theme = useTheme()
  const [selectDateRange, setSelectDateRange] = useState({});
  const [originalData,setOriginalData] = useState({});
  const [data, setData] = useState([]);
  const [activeView, setActiveView] = useState('month');
  
  useEffect(()=>{
    handleView(activeView)
  },[activeView])

  useEffect(()=>{
    // get year data initially
    axiosInstance.get(`/trends`)
    .then(response =>{
      console.log('api data: ',response.data)
      setData(response.data)
      setOriginalData(response.data)

    })
    .catch(error=>console.error(error))
  },[userData])

  function getLast6MonthsRange(currentDate) {
    // Calculate the end date as today
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    // Calculate the start date as 6 months ago
    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - 6);

    return { start: startDate, end: endDate };
}

  const handleView = (view) =>{

    let dateRange = null
    switch(view) {
      case "month":
        dateRange = getMonthRange(new Date());
        break;
      case "6 months":
        dateRange = getLast6MonthsRange(new Date());
        break;
      case "year":
        dateRange = getYearRange(new Date());
        break;
      default:
        dateRange = getWeekRange(new Date());

    }
    if(dateRange){
      dateRange = {
        start: Math.floor((dateRange.start).getTime()),
        end: Math.floor((dateRange.end).getTime()),
      };
    }
    console.log(`dateRange: ${new Date(dateRange.start).toLocaleDateString()} - ${new Date(dateRange.end).toLocaleDateString()}`)
    setActiveView(view);
    setSelectDateRange(dateRange);
  }

  const handleSelectDate = ({start, end}) => {
    setSelectDateRange({start, end})
    setActiveView(null)
  }

  return (
    <Container>
    <Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap:'0.2rem', flexWrap:'wrap', }}>
          {["month","6 months","year","select range"].map((view)=>{
              if(view==='select range'){
                return <DateRangePickerModal handleSelectDate={handleSelectDate} />
              } else {
                return <Button
                        key={view}
                        onClick={() => handleView(view)}
                        sx={{
                          textDecoration: activeView === view ? 'solid 1px underline' : "none",
                          '&:hover': {
                              textDecoration: 'underline', // Ensures underline stays on hover
                          },
                          color: activeView === view ? theme.palette.primary.main : theme.palette.primary.main
                        }}
                        >{view}</Button>
              }
              
            })}
        </Box>

    </Box>


    <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
      {data && Object.entries(data).map(([key,value,index])=>{
        // console.log('groupData value.data ',value.data)
        return <TrendsGroup
                key={key}
                dateRange={selectDateRange} 
                groupTitle={key}
                groupAttributes={value.options}
                groupData={value.data}
                // views={}
                />
      })
      }
    </Box>
    
    </Container>
  );
}

export default TrendsPage;


