import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function MeasurementPageHeader () {
    const navigate = useNavigate();
    return (
  

            <Box 

            sx={{ 
                // border:"1px solid magenta",
                // height:"1rem",
                width: "100%",
                display: 'flex',
                justifyContent:'space-around',
                alignItems:"center"
            
    
            }}
        >
            {/* Title */}
            <Typography variant="h2" fontSize="1.7rem" color="primary" >
                MEASUREMENTS
            </Typography>

            {/* Back button return to page navigated from */}
            <Button variant='contained' 
                sx={{
                    height: '1.8rem',
                    width: '3rem', // Set width and height to make the button smaller
                    minWidth: 'auto', // Ensure button content doesn't affect the size
                }}
            
                onClick={() => { navigate(-1) }} >
                <ArrowBackIcon 
                sx={{transform: 'scaleX(-1)',  fontSize: '0.8rem'}}/>
            </Button>

        </Box>

 

 

    )
}

export default MeasurementPageHeader;