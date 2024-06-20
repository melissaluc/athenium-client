// src/components/AddGoalModal.jsx
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditGoalForm from '../Forms/EditGoalForm';
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

function EditGoalModal({data, handleEditGoal, handleDeleteGoal, setUpdatedFields }) {

  const [open, setOpen] = useState(false);



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  return (
    <Box>
      <Button onClick={handleOpen}>Edit</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
          <EditGoalForm onClose={handleClose} data={data} handleEditGoal={handleEditGoal} handleDeleteGoal={handleDeleteGoal} setUpdatedFields={setUpdatedFields}/>
      </Box>
      </Modal>
    </Box>
  );
}

export default EditGoalModal;
