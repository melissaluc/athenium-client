import { Box, Container, Typography, Button } from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import { useState } from 'react';
import GoalsCard from '../components/GoalsCard';
import goalsData from '../data/goals.json';

function GoalsPage() {
  const [selectDate, setSelectDate] = useState(new Date());
  const [originalData] = useState(goalsData.goals);
  const [data, setData] = useState(goalsData.goals);
  const [activeView, setActiveView] = useState('all');

  console.log(activeView)
  const filterData = (filterValue) => {
    if (filterValue === 'all') {
      setData([...originalData]);
    } else {
      setData([...originalData].filter(item => item.status === filterValue));
    }
    setActiveView(filterValue);
  };
//   TODO: work on styling the button when set as active view
  const getButtonStyle = (view) => ({
    backgroundColor: activeView === view ? 'white' : 'default',
    // color: activeView === view ? 'black' : 'default'
  });

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Goals</Typography>
        <DrawerNavBar />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Button>+ Add Goal</Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#BBC5D4', margin: "1rem 0" }}>
        <Button sx={getButtonStyle('in progress')} onClick={() => {filterData('in progress') }}>In Progress</Button>
        <Button sx={getButtonStyle('pending')} onClick={() => filterData('pending')}>Pending</Button>
        <Button sx={getButtonStyle('achieved')} onClick={() => filterData('achieved')}>Achieved</Button>
        <Button sx={getButtonStyle('all')} onClick={() => filterData('all')}>All</Button>
        <Button sx={getButtonStyle('trend')} onClick={() => setActiveView('trend')}>Trend</Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((goal) => {
          const { id, name, category, description, metric, units, updated_on,start_date, target_value, current_value, start_value, status } = goal;
          return (
            <GoalsCard
              key={id}
              name={name}
              category={category}
              description={description}
              metric={metric}
              units={units}
              updated_on={updated_on}
              start_date={start_date}
              target_value={target_value}
              current_value={current_value}
              start_value={start_value}
              status={status}
            />
          );
        })}
      </Box>
    </Container>
  );
}

export default GoalsPage;
