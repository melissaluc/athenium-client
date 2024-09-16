import { Button, Typography, Container, Box, Card, CardContent } from '@mui/material';



function ParamsCard({paramName, paramValue, uom}) {
    return(


        <Card
            sx={{
                width:"5rem",
                height:"5rem"
            }}
        >
            <CardContent>
                <Typography fontSize="0.6rem" fontWeight={'bold'} sx={{ wordWrap: "break-word"}}>
                   {paramName.toUpperCase()}
                </Typography>
                <Box sx={{
                    display:'flex',
                    gap:'0.1rem',
                    alignItems: "baseline",
                }}>
                    <Typography fontSize={"0.9rem"}>
                    {paramValue}
                    </Typography>
                    <Typography fontSize={"0.7rem"}>
                    {uom}
                    </Typography>
                </Box>
            </CardContent>
        </Card>

    )
}


export default ParamsCard;