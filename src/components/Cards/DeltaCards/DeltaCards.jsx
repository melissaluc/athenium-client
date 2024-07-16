import { Button, Typography, Container, Box, Card, CardContent, CardHeader } from '@mui/material';



function DeltaCards({header, value, units}) {
    return(
        <Card sx={{
            // padding:'1rem 0.2rem',
            border: "none",
            boxShadow: "none", 
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',

        }}>
            <CardContent
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center'
                }}
            >
            <Box
                sx={{
                    display:'flex',
                    gap:'0.1rem',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                <Typography fontSize="0.8rem">{value}</Typography>
                <Typography fontSize="0.8rem">{units}</Typography>
            </Box>
                <Typography fontSize="0.7rem" sx={{textAlign:"center"}}>{header}</Typography>
            </CardContent>
        </Card>
    )
}


export default DeltaCards;