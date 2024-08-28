// src/components/AddGoalModal.jsx
import { useState} from 'react';
import {Box, IconButton, Modal} from '@mui/material';

import DateRangeIcon from '@mui/icons-material/DateRange';
import DateRangePicker from '../DatePickers/DateRangePicker';


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


function DateRangePickerModal({handleSelectDate}) {

  const [open, setOpen] = useState(false);



  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  return (
    <Box>
      <IconButton color='primary' onClick={handleOpen}><DateRangeIcon/></IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
          <DateRangePicker handleSelectDate={handleSelectDate} handleClose={handleClose}/>
      </Box>
      </Modal>
    </Box>
  );
}

export default DateRangePickerModal;
