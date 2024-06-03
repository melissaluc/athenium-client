// src/components/AddGoalModal.jsx
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import GoalForm from '../Forms/GoalForm';
import { maxHeight } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight:'90vh',
  overflow:'auto'

};

function GoalModal({handleAddGoal}) {

  const [open, setOpen] = useState(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button onClick={handleOpen}>+ Add Goal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
       <Box sx={style}>
          <GoalForm onClose={handleClose} handleAddGoal={handleAddGoal}/>
        </Box>
    
      </Modal>
    </Box>
  );
}

export default GoalModal;
