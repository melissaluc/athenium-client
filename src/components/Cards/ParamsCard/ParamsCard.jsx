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
                    // justifyContent:''
                    alignItems: "baseline",
                }}>
                    <Typography>
                    {paramValue}
                    </Typography>
                    <Typography fontSize={"0.8rem"}>
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