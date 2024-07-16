import { Button, Typography, Container, Box, Card, CardContent } from '@mui/material';
import CircularAvatar from "../CircularAvatar/CircularAvatar"
import {useState} from 'react'


function DashboardHeader ({userAvatar, userData}) {
    const [showNavBar, setShowNavBar] = useState(false)
    return(
        <Box sx={{display:'flex', width:"100%", justifyContent:'space-between'}}>
        <Box className='userNavBar' sx={{display:'flex', width:"100%", gap:'2rem'}}>
            {/* <Box sx={{borderRadius:'50%', border:'1px solid black', width:'2rem', height:'2rem'}}> */}
                <CircularAvatar width="4rem" height="4rem" src={userAvatar} alt='user-profile-img'/>
            {/* </Box> */}
            <Box>
                <Box>
                    {/* Name of User */}
                    <Typography fontSize="0.8rem">Welcome back,</Typography>

                    <Typography fontSize="0.8rem">
                        {`${userData.first_name} ${userData.last_name}`}
                    </Typography>

                </Box>
                {/* User Age & Height */}
                <Box
                    sx={{
                        display:'flex',
                        gap:"2rem"
                    }}
                >
                    <Box>
                        <Typography fontSize="0.8rem">{userData.age}</Typography>
                        <Typography fontSize="0.8rem">Age</Typography>
                    </Box>
                    <Box>
                        <Typography fontSize="0.8rem">{userData.height}</Typography>
                        <Typography fontSize="0.8rem">Height</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>

    </Box>

    )
}


export default DashboardHeader;