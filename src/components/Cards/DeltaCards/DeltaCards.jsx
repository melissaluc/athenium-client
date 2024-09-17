import { Button, Typography, Container, Box, Card, CardContent, CardHeader, Chip } from '@mui/material';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


function DeltaCards({header, value, units}) {
    const isIncreasing = value > 0;
    let trendIcon = null
    if(value > 0){
        trendIcon =  <ArrowDropUpIcon />
    } else if(value < 0) {
        trendIcon = <ArrowDropDownIcon/>
    } 
    // else {
    //     trendIcon= <TrendingFlatIcon/>
    // }

    return(
        <Card sx={{
            // padding:'1rem 0.2rem',
            // border: "none",
            // boxShadow: "none", 
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
            alignItems:'center',

        }}>
            <CardContent
                sx={{
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'space-between',
                    // alignItems:'center'
                }}
            >
            <Typography fontSize="0.6rem" fontWeight='bold' sx={{textAlign:"center"}}>{header.toUpperCase()}</Typography>
            <Box
                sx={{
                    display:'flex',
                    gap:'0.1rem',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                <Chip icon={trendIcon} label={`${Math.abs(value)}${units!== null ? units : ''}`} 
                    sx={{
                        backgroundColor: value > 0 ? 'rgb(178, 206, 178)' : (value < 0 ? 'rgb(191, 210, 228)': 'default'),
                        color: 'rgb(73, 74, 73)',
                        '& .MuiChip-label': {
                        display: 'flex',
                        alignItems: 'flex-start',
                        p:value != 0 ? '0 0.5rem 0 0.2rem' : '0 1rem',
                        gap: 0, // Remove gap between icon and label
                        },
                        '& .MuiChip-icon': {
                                color: value > 0 ? 'green' :  'blue' ,
                            },
                        }}
                />
            </Box>
            </CardContent>
        </Card>
    )
}


export default DeltaCards;