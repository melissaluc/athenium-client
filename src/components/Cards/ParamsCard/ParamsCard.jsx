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
                <Typography fontSize="0.7rem" sx={{ wordWrap: "break-word"}}>
                   {paramName}
                </Typography>
            </CardContent>
        </Card>

    )
}


export default ParamsCard;