import React, { useEffect, useState, useContext } from 'react';
import { Box, Container, Button } from "@mui/material";
import GoalsCard from '../components/GoalsCard';
import GoalModal from "../components/Modals/GoalModal";
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { UserDataContext } from '../UserDataContext';

function GoalsPage() {
  const {userData, setUserData }= useContext(UserDataContext);
  const [fullData, setFullData] = useState([]);
  const [data, setData] = useState([]);
  const [activeView, setActiveView] = useState('in progress');
  const base_api_url = process.env.REACT_APP_API_BASE_URL
  const handleEditGoal = (goalData) => {
 
    const putData = {...goalData, uid:goalData.id, goal_name: goalData.name, uom:goalData.unit }
    delete putData.id 
    delete putData.name
    delete putData.unit

    axios.put(`${base_api_url}/goals/${userData.user_id}/${goalData.id}`,putData)
    .then(response => {
      console.log(response.data)
      const updatedData = fullData.map(goal => {
        if (goal.uid === putData.uid) {
          return { ...goal, ...putData };
        }
        return goal;
      });
      setFullData(updatedData);

    })
    .catch(error => console.error(error))
  };

  const handleAddGoal = (newGoal) => {
    const uid = uuidv4();
    const updatedFullData = [...fullData, newGoal];
    const postData = { ...newGoal, uid};
    delete postData.id
    axios.post(`${base_api_url}/goals/${userData.user_id}/`,postData)
    .then(response => {
      console.log(response.data)
      setFullData(updatedFullData);
      setActiveView('pending');
    })
    .catch(error => console.error(error))
  };

  const handleDeleteGoal = (deleteGoal) => {
    console.log(deleteGoal)
    const updatedFullData = fullData.filter(goal => goal.uid !== deleteGoal);
    axios.delete(`${base_api_url}/goals/${userData.user_id}/${deleteGoal}`)
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
    axios.get(`${base_api_url}/goals/${userData.user_id}/`)
    .then(response => {
      console.log(response.data)
      setFullData(response.data)
      setData(response.data)
    })
    .catch(error => console.error(error))
  },[userData])

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
