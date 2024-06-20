import React, { useEffect, useState } from 'react';
import { Box, Container, Button } from "@mui/material";
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import GoalsCard from '../components/GoalsCard';
import goalsData from '../data/goals.json';
import GoalModal from "../components/Modals/GoalModal";
import axios from 'axios'


function GoalsPage() {
  const [fullData, setFullData] = useState([]);
  const [data, setData] = useState([]);
  const [activeView, setActiveView] = useState('in progress');

  const handleEditGoal = (goalData) => {
    const updatedData = fullData.map(goal => {
      if (goal.uid === goalData.uid) {
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

  const handleDeleteGoal = (deleteGoal) => {
    console.log(deleteGoal)
    const updatedFullData = fullData.filter(goal => goal.uid !== deleteGoal);
    axios.delete(`http://localhost:5000/api/v1/goals/39b17fed-61d6-492a-b528-4507290d5423/${deleteGoal}`)
    .then(response => {
      console.log(response.data)
      setFullData(updatedFullData);
    })
    .catch(error => console.error(error))
    // setActiveView('pending');
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

  useEffect(()=>{
    axios.get('http://localhost:5000/api/v1/goals/39b17fed-61d6-492a-b528-4507290d5423/')
    .then(response => {
      console.log(response.data)
      setFullData(response.data)
      setData(response.data)
    })
    .catch(error => console.error(error))
  },[])

  const getButtonStyle = (view) => ({
    backgroundColor: activeView === view ? '#d7aecf' : 'default',
    color: activeView === view ? 'white' : 'default',
  });

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <DrawerNavBar />
      </Box>

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
          const { uid, goal_name, category, description, metric, uom, updated_on, start_date, target_value, current_value, start_value, status } = goal;
          return (
            <GoalsCard
              key={uid}
              id={uid}
              name={goal_name}
              category={category}
              description={description}
              metric={metric}
              unit={uom}
              updated_on={updated_on}
              start_date={start_date}
              target_value={target_value}
              current_value={current_value}
              start_value={start_value}
              status={status}
              handleEditGoal={handleEditGoal}
              handleDeleteGoal={handleDeleteGoal}
            />
          );
        })}
      </Box>
    </Container>
  );
}

export default GoalsPage;
