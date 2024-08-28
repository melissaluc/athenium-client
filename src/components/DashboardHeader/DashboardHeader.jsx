import {Typography,Box } from '@mui/material';
import CircularAvatar from "../CircularAvatar/CircularAvatar"
import {useContext} from 'react'
import { UserDataContext } from '../../Contexts/UserDataContext';

function DashboardHeader () {
    const { userData } = useContext(UserDataContext);
    return(
        <Box sx={{display:'flex', width:"100%", justifyContent:'space-between'}}>
        <Box className='userNavBar' sx={{display:'flex', width:"100%", gap:'2rem'}}>
            {/* <Box sx={{borderRadius:'50%', border:'1px solid black', width:'2rem', height:'2rem'}}> */}
                <CircularAvatar width="4rem" height="4rem" src={userData.profile_img} alt='user-profile-img'/>
            {/* </Box> */}
            <Box>
                <Box>
                    <Typography sx={{fontWeight:'bold'}} >
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
                    <Box >
                        <Typography fontSize="0.8rem">AGE</Typography>
                        <Typography fontSize="0.8rem">{userData.age}</Typography>
                    </Box>
                    <Box>
                        <Typography fontSize="0.8rem">HEIGHT</Typography>
                        <Typography fontSize="0.8rem">{userData.height_cm}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>

    </Box>

    )
}


export default DashboardHeader;