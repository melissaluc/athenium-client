import { Box, Container, Typography, Button } from "@mui/material"; 
import DrawerNavBar from "../components/NavBar/DrawerNavBar/DrawerNavBar";
import { useState } from 'react';
import LogItemCard from '../components/LogItemCard';
import logData from '../data/log.json';

function LogPage() {
  const [selectDate, setSelectDate] = useState(new Date());
  const [originalData] = useState(logData);
  const [data, setData] = useState(logData);




  return (
    <Container  sx={{ display: 'flex', flexDirection:"column", justifyContent: 'center'}}>

      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Button>+ Log Item</Button>
      </Box>

      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((log) => {
          const { id, timestamp, metric, value, uom, notes} = log;
          return (
            <LogItemCard
              key={id}
              uom={uom}
              timestamp={timestamp}
              metric={metric}
              value={value}
              notes={notes}
            />
          );
        })}
      </Box>
      <Button>Load More</Button>
    </Container>
  );
}

export default LogPage;
