import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import GoalBodyMeasurementSlider from './GoalsSetterSlider';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
//   border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




function GoalModal({values}) {
    const [selectBodyPart, setSelectBodyPart] = useState(null);
    const [open, setOpen] = useState(false);
    const [bodyMeasurementGoal, setBodyMeasurementGoal] = useState(0);
    const [goals, setGoals] = useState({});
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSelectBodyPart = (bodyPart) =>{

        setSelectBodyPart(bodyPart); 

        // Check if goals exist and if the goal for the selected body part is defined
        if (goals && goals[bodyPart] !== undefined) {
            // If the goal exists in goals, set it as the bodyMeasurementGoal
            setBodyMeasurementGoal(goals[bodyPart]);
        } else if (values && values[bodyPart] !== undefined) {
            // If the goal doesn't exist in goals but exists in values, set it as the bodyMeasurementGoal
            setBodyMeasurementGoal(values[bodyPart]);

        }
    }

    const handleBodyMeasurementChange = (event, newValue) => {
        setBodyMeasurementGoal(newValue);
    };

    useEffect(()=>{
        // Retrieve set goals if exist and set bodyMeasurement to it
        if (values && selectBodyPart && values[selectBodyPart] !== undefined) {
            setGoals({})
            setBodyMeasurementGoal(values[selectBodyPart]);
          }
    },[]) 

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
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Set a goal body measurement
            </Typography>
            <Box sx={{display:'flex', flexWrap:'wrap' ,gap:'0.5rem'}}>
            {values && Object.keys(values).map((key)=>{
                return(
                    <Button onClick={()=>{handleSelectBodyPart(key)}} 
                    sx={{border:'1px solid black', padding:'0.5rem'}}>
                        <Typography>{key}</Typography>
                    </Button>
                )
            })}

            </Box>
            { selectBodyPart &&
                <Box sx={{margin:'1rem 0 0 0'}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {selectBodyPart && `Set goal for ${selectBodyPart}`}
                    </Typography>
                    <Typography>
                        {`Current measurement is ${values[selectBodyPart]} inches`}
                    </Typography>
                    <GoalBodyMeasurementSlider 
                        currentValue={values[selectBodyPart]}
                        bodyPart={selectBodyPart}
                        value={bodyMeasurementGoal}
                        onChange={handleBodyMeasurementChange}/>
                </Box>

            }
        </Box>
        </Modal>
    </Box>
    );
}


export default GoalModal;