import {Box, Button, Typography, Table, TableContainer, TableCell, TableRow, TableHead, TableBody} from '@mui/material/';
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
            <Typography>Your strength level for {exercise_name} is {strength_level}</Typography>
            <Typography>{getStrengthRating(strength_level)}</Typography>
            <Typography>Your estimated one-rep-max is {one_rep_max}lb</Typography>
            <Typography>You are stronger than {relative_strength_demographic}% of lifters your age weighing {body_weight}lb</Typography>
            <Typography>Your lift is {lift/body_weight} times your body weight</Typography>

            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow>
                    {orderOfLevels.map((level, index) => (
                        <TableCell key={index}>{level.toLocaleUpperCase()}</TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                    {orderedValues.map((value, index) => (
                        <TableCell key={index} style={{ backgroundColor: value === strength_bounds[strength_level] ? getProgressColour(strength_level, theme) : 'transparent' }}>
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