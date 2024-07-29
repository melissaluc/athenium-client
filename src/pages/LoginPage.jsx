import { GoogleLogin } from '@react-oauth/google';
import { Box,Container } from '@mui/material';
import AtheniumLogo from '../assets/AtheniumLogo';


function LoginPage({}){


    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };
    return (
        <Container sx={{display:'flex', flexDirection:'column', width: "80vw"}}>
            <AtheniumLogo width={"10rem"}/>
            <Box sx={{width:"20vw"}}>
                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </Box>
        </Container>
    )

}

export default LoginPage;