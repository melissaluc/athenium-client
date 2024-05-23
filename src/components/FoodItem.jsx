import { Box, Typography} from "@mui/material"; 

function FoodItem ({foodName, protein, carbs, fat, calories}) {
    return(
        <Box sx={{
            borderBottom:'1px solid black', 
            '&:last-child': {
            borderBottom: 'none',
            },
            padding:'0.5rem 0',
            }}>
        <Typography>{foodName}</Typography>
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