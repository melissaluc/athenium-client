import {Box, Button, Typography, Table, TableContainer, TableCell, TableRow, TableHead, TableBody, Paper} from '@mui/material/';
import {getProgressColour,  getStrengthRating} from '../utils/utils'
import { useTheme } from '@mui/material/styles';


function StrengthResults ({handleClose, results}) {
    const {exercise_name, lift, one_rep_max, relative_strength_demographic, strength_bounds, strength_level, body_weight} = results
    const theme = useTheme();
    const orderOfLevels = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];
    const orderedValues = orderOfLevels.map(level => strength_bounds[level]);

    return(
        <Box sx={{display:'flex', flexDirection:'column'}}>
            <Button sx={{alignSelf:'flex-end'}} onClick={()=>{handleClose(false)}}>close</Button>
            <Box display='flex'sx={{flexDirection:'column', alignItems:'center'}}>
                <Typography variant='subtitle1' fontSize='1.5rem'>Your strength level for {exercise_name} is</Typography>
                <Typography variant='h6' fontSize='1.5rem'>{strength_level}</Typography>
                <Typography>{getStrengthRating(strength_level)}</Typography>
                <ul>
                    <li>
                        <Typography fontSize='0.8rem'>Your estimated one-rep-max is {one_rep_max}lb</Typography>
                    </li>
                    <li>
                        <Typography fontSize='0.8rem'>You are stronger than {relative_strength_demographic}% of lifters your age weighing {body_weight}lb</Typography>
                    </li>
                    <li>
                        <Typography fontSize='0.8rem'>Your lift is {(lift/body_weight).toFixed(2)} times your body weight</Typography>
                    </li>
                </ul>
            </Box>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', maxWidth: { xs: '100%', sm: '90%', md: '80%' } }}>
                <Table>
                <TableHead>
                    <TableRow>
                    {orderOfLevels.map((level, index) => (
                        <TableCell key={index}
                            sx={{
                                fontSize: { xs: '0.6rem', sm: '0.875rem' },
                                padding: { xs: '8px', sm: '16px' },
                                width: { xs: '20%', sm: '20%' }
                            }}
                        >{level.toLocaleUpperCase()}</TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    {orderedValues.map((value, index) => (
                        <TableCell key={index} sx={{ 
                            backgroundColor: value === strength_bounds[strength_level] ? getProgressColour(strength_level, theme) : 'transparent',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            padding: { xs: '8px', sm: '16px' }
                            }}>
                        {value}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )   
}


export default StrengthResults