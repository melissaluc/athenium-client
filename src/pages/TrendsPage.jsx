import { Box, Container, Typography, Button } from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import { useState, useEffect } from 'react';
import trendsData from '../data/trends.json';
import TrendsGroup from "../components/TrendsGroup";


function TrendsPage() {
  const [selectDate, setSelectDate] = useState(new Date());
  const [selectDateRange, setSelectDateRange] = useState(new Date());
  const [originalData] = useState(trendsData);
  const [data, setData] = useState(trendsData);
  const [activeView, setActiveView] = useState('all');
  

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Trends</Typography>
        <DrawerNavBar />
      </Box>
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap:'0.5rem', flexWrap:'wrap', backgroundColor:'lightblue'}}>
            <Button>Week</Button>
            <Button>Month</Button>
            <Button>Year</Button>
            <Button>All</Button>
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


