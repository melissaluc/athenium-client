import { Button, Typography, Container, Box, Card, CardContent, CardHeader } from '@mui/material';



function DeltaCards({header, value, units}) {
    return(
        <Card sx={{
            width:"5rem",
            height:"5rem",
            border: "none",
            boxShadow: "none", 
            marginBottom: "1rem",
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center'
        }}>
            <CardContent
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center'
                }}
            >
                <Typography fontSize="0.9rem">{value}{units}</Typography>
                <Typography fontSize="0.7rem" sx={{textAlign:"center"}}>{header}</Typography>
            </CardContent>
        </Card>
    )
}


export default DeltaCards;