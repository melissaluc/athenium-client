import { Box, Typography, Button} from "@mui/material"; 
import {useState} from 'react'


function FoodItem ({foodName, protein, carbs, fat, calories,  quantity, uom}) {
    const [showEdit, setShowEdit] = useState(false)

    return(
        <Box sx={{
            borderBottom:'1px solid black', 
            '&:last-child': {
            borderBottom: 'none',
            },
            padding:'0.5rem 0',
            }}
            >
        <Box sx={{display: 'flex', justifyContent: 'space-between'}} >
            <Typography onClick={()=>setShowEdit(true)} sx={{width:'50%'}}>{foodName}, {quantity} {uom}</Typography>
            {showEdit && <Box sx={{zIndex:10}}>
                <Button onClick={()=>setShowEdit(false)}>Cancel</Button>
                <Button >Edit</Button>
            </Box>}
        </Box>
        <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <Box sx={{display:'flex'}}>
                <Box>
                    <Typography sx={{marginRight:'1rem'}}>Protein</Typography>
                    <Typography sx={{marginRight:'1rem'}}>{protein} g </Typography>
                </Box>
                <Box>
                    <Typography sx={{marginRight:'1rem'}}>Carbs</Typography>
                    <Typography sx={{marginRight:'1rem'}}>{carbs} g</Typography>
                </Box>
                <Box>
                    <Typography sx={{marginRight:'1rem'}}>Fat</Typography>
                    <Typography sx={{marginRight:'1rem'}}>{fat} g </Typography>
                </Box>
            </Box>
            <Typography>{calories} cal</Typography>
        </Box>
    </Box>
    )
}

export default FoodItem;