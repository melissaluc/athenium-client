import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import StrengthResults from '../StrengthResults'
import { Typography, LinearProgress } from '@mui/material';


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


function ResultsModal({open, handleClose, results, error, handleStrengthCalcError}) {
  
  const handleError = () => {
    handleStrengthCalcError()
    handleClose(false)
  }

  return (
    <Box>
      {/* <Button onClick={handleClose}>Close</Button> */}
      <Modal
        open={open}
        onClose={handleError}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      <Box sx={style}>
        {error ? (
          <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Button sx={{alignSelf:'flex-end'}} onClick={handleError}>close</Button>
            <Typography>(っ °Д °;)っ Error ❌</Typography>
          </Box>
        )
        :(results ? (
          <StrengthResults results={results} handleClose={handleClose} />
        ) : (
          <>
            <Typography variant='h6' color={'primary'}>Calculating Strength</Typography>
            <LinearProgress />
          </>
        ))}
      </Box>
      </Modal>
    </Box>
  );
}

export default ResultsModal;
