import { Box, Container, Typography, Button } from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import { useState, useEffect } from 'react';
import trendsData from '../data/trends.json';
import TrendsGroup from "../components/TrendsGroup";
import { useTheme } from "@emotion/react";
import { startOfWeek, endOfWeek, startOfMonth,endOfMonth, startOfYear, endOfYear, format } from 'date-fns';


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
  const theme = useTheme()
  const [selectDateRange, setSelectDateRange] = useState(null);
  const [originalData] = useState(trendsData);
  const [data, setData] = useState(trendsData);
  const [activeView, setActiveView] = useState('week');
  
  const handleView = (view) =>{

    let dateRange = null
    switch(view) {
      case "week":
        dateRange = getWeekRange(new Date());
        break;
      case "month":
        dateRange = getMonthRange(new Date());
        break;
      case "year":
        dateRange = getYearRange(new Date());
        break;
      case "all":
        dateRange = {start:	1685505759,end:1717113759}
        break;
      default:
        dateRange = getWeekRange(new Date());

    }
    if(dateRange){
      dateRange = {
        start: Math.floor((dateRange.start).getTime() / 1000),
        end: Math.floor((dateRange.end).getTime() / 1000),
      };
    }
    setActiveView(view);
    setSelectDateRange(dateRange);
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* <Typography>{selectDateRange}</Typography> */}
        <DrawerNavBar />
      </Box>
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'0.5rem', flexWrap:'wrap', backgroundColor:theme.palette.secondary.main}}>
          {["week","month","year","all"].map((view)=>{
              return <Button
                      key={view}
                      onClick={() => handleView(view)}
                      sx={{
                        backgroundColor: activeView === view ? "white" : "none",
                        color: activeView === view ? theme.palette.primary.main : theme.palette.primary.main
                      }}
                      >{view}</Button>
              
            })}
        </Box>
        <Button>Select Range</Button>

    </Box>


    <Box sx={{display:'flex', flexDirection:'column', gap:'1rem'}}>
      {Object.entries(data).map(([key,value,index])=>{
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


