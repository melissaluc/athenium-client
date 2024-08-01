import { GoogleLogin } from '@react-oauth/google';
import { Box,Container } from '@mui/material';
import AtheniumLogo from '../assets/AtheniumLogo';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function LoginPage({}){
    const navigate = useNavigate();
    const handleLoginSuccess = (response) => {
        // Send the Google token to your server
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/google/login`, {
          token: response.credential,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            // Handle successful login response from server
            console.log(res.data); // axios automatically parses JSON
            if(res.data.success) {
                // Set authtoken
                navigate(`/dashboard`)
                localStorage.setItem('authToken', res.data.token);
            }
          })
          .catch((error) => {
            // Handle errors
            console.error('Error:', error);
          });
      };
    
    const errorMessage = (error) => {
        console.log(error);
    };
    return (
        <Container sx={{display:'flex', flexDirection:'column', width: "80vw"}}>
            <AtheniumLogo width={"10rem"}/>
            <Box sx={{width:"20vw"}}>
                <GoogleLogin onSuccess={handleLoginSuccess} onError={errorMessage} />
            </Box>
        </Container>
    )

}

export default LoginPage;