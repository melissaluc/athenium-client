import React, { useEffect, useState } from 'react';
import { Box, Container, Button } from "@mui/material";
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import GoalsCard from '../components/GoalsCard';
import goalsData from '../data/goals.json';
import GoalModal from "../components/Modals/GoalModal";

function GoalsPage() {
  const [fullData, setFullData] = useState(goalsData.goals);
  const [data, setData] = useState(goalsData.goals);
  const [activeView, setActiveView] = useState('in progress');

  const handleEditGoal = (goalData) => {
    const updatedData = fullData.map(goal => {
      if (goal.id === goalData.id) {
        return { ...goal, ...goalData };
      }
      return goal;
    });
    console.log('edit goal ', updatedData);
    setFullData(updatedData);
  };

  const handleAddGoal = (newGoal) => {
    const updatedFullData = [...fullData, newGoal];
    setFullData(updatedFullData);
    setActiveView('pending');
  };

  const filterData = (filterValue) => {
    if (filterValue === 'all') {
      setData([...fullData]);
    } else {
      setData(fullData.filter(item => item.status === filterValue));
    }
    setActiveView(filterValue);
  };

  useEffect(() => {
    filterData(activeView);
  }, [fullData, activeView]);

  const getButtonStyle = (view) => ({
    backgroundColor: activeView === view ? '#d7aecf' : 'default',
    color: activeView === view ? 'white' : 'default',
  });

  return (
    <Container>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '1rem 0' }}>
        <GoalModal handleAddGoal={handleAddGoal} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#BBC5D4', margin: "1rem 0" }}>
        <Button sx={getButtonStyle('in progress')} onClick={() => filterData('in progress')}>In Progress</Button>
        <Button sx={getButtonStyle('pending')} onClick={() => filterData('pending')}>Pending</Button>
        <Button sx={getButtonStyle('achieved')} onClick={() => filterData('achieved')}>Achieved</Button>
        <Button sx={getButtonStyle('all')} onClick={() => filterData('all')}>All</Button>
        <Button sx={getButtonStyle('trend')} onClick={() => setActiveView('trend')}>Trend</Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((goal) => {
          const { id, name, category, description, metric, unit, updated_on, start_date, target_value, current_value, start_value, status } = goal;
          return (
            <GoalsCard
              key={id}
              id={id}
              name={name}
              category={category}
              description={description}
              metric={metric}
              unit={unit}
              updated_on={updated_on}
              start_date={start_date}
              target_value={target_value}
              current_value={current_value}
              start_value={start_value}
              status={status}
              handleEditGoal={handleEditGoal}
            />
          );
        })}
      </Box>
    </Container>
  );
}

export default GoalsPage;
