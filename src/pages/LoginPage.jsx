import { GoogleLogin } from '@react-oauth/google';
import { Box,Container, Typography, Divider, Link } from '@mui/material';
import AtheniumLogo from '../assets/AtheniumLogo';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm'
import { styled } from '@mui/material/styles';

function LoginPage({}){
    const navigate = useNavigate()

    const Root = styled('div')(({ theme }) => ({
      width: '100%',
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
      '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
      },
    }));

    const handleLoginSuccess = (response) => {
      // Send the Google token to your server
      axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, response, {
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

    const handleGoogleLoginSuccess = (response) => {
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
        <Container sx={{display:'flex', flexDirection:'column',alignItems:'center' }}>
            <Root sx={{display:'flex', flexDirection:'column', width: "70vw", alignItems:'center', margin:'10% 0%'}}>
              <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <AtheniumLogo width={"1`00%"}/>
                <Typography variant='h4' sx={{margin:'2rem', cursor:'default', userSelect: 'none',}}>LOGIN</Typography>
                <LoginForm errorMessage={errorMessage} handleLoginSuccess={handleLoginSuccess}/>
                <Divider sx={{ width: '90%', marginY: 2, cursor:'default', userSelect: 'none', }} orientation="horizontal" component="div" role="presentation" aria-hidden="true">Or Login with</Divider>

              </Box>
              <Box sx={{width:"20vw", display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={errorMessage} />
              </Box>
            </Root>
            <Box>
              <Link
                href="#"
                variant="body2"
                sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                Sign Up
              </Link>
            </Box>
        </Container>
    )

}

export default LoginPage;