import { Box,  Typography, Card,CardContent, CardActionArea, CardActions, Button} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";



function LogItemCard ({
                        timestamp: updated_on,
                        metric,
                        value,
                        uom,
                        notes}) {

    const [expandWorkout, setExpandWorkout] = useState(false)
    const updateDateFormatted = new Date(updated_on*1000)
            
    return(
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', flexDirection:'column', justifyContent:'flex-start', gap:'0.5rem'}}>
                    <Box sx={{ display: 'flex', justifyContent:'space-between'}}>
                        <Box>
                            <Typography fontSize="0.7rem">Logged on {updateDateFormatted.toLocaleDateString()}</Typography>
                            {/* <Typography fontSize={'0.7rem'}>{emoji}</Typography> */}
                        </Box>

                        <Button>Edit</Button>
                    </Box>
                    <Box>
                        {/* <Typography fontSize={'0.7rem'}>{category}</Typography> */}
                        <Typography fontWeight={'bold'}>{metric.replace(/_/g, " ").toUpperCase()}</Typography>
                        <Box sx={{marginTop:'0.7rem'}}>
                            <Typography fontSize='0.8rem'>{`Value: ${value}`.toUpperCase()}</Typography>
                            <Typography fontSize='0.8rem'>{`Units: ${uom}`.toUpperCase()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent:'space-evenly', gap:"1rem"}}>
                        </Box>
                    </Box>
                </Box>
            
             
                {notes && expandWorkout &&    
                <Box>
                    <Box >
                        {notes? <Typography>{notes}</Typography> : <Typography >No Notes Added</Typography>}
                    </Box>

                </Box>
                }
            </CardContent>
            { notes &&
                <CardActionArea>
                    <CardActions sx={{width:'100%', margin:'0px', padding:'0px'}}>
                        <Button onClick={()=>{ setExpandWorkout(prev => !prev)}} sx={{width:'100%', margin:'0px', padding:'0px'}}>
                    
                                <ArrowDropDownIcon sx={{transform: expandWorkout? 'scaleY(-1)': 'none'}}/>
                
                        </Button>
                    </CardActions>
                </CardActionArea>
            }
        </Card>
    )
}

export default LogItemCard;