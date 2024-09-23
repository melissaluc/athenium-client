import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Typography, Divider, Button, Fab, Stack } from '@mui/material';
import AtheniumLogo from '../assets/AtheniumLogo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm';
import { styled } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';
import { UserDataContext } from '../Contexts/UserDataContext';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';

function LoginPage() {
    const navigate = useNavigate();
    const { userData, updateUserData, setLoading, loading } = useContext(UserDataContext);
    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
      setExpanded(!expanded);
    };
  
    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));

    const handleLoginSuccess = async (credentials) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, credentials, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.data.success) {
                localStorage.setItem('authToken', res.data.token);
                setLoading(true);
                await updateUserData();
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGoogleLoginSuccess = async (response) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/google/login`, {
                token: response.credential,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.data.success) {
                localStorage.setItem('authToken', res.data.token);
                setLoading(true);
                await updateUserData();
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    useEffect(() => {
        if (userData && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [userData, navigate, loading]);

    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10%', maxWidth:'smn'}}>
            <Box sx={{ position: 'relative' }}>
            <Fab 
                color="primary" 
                aria-label={expanded ? "close" : "add"} 
                onClick={handleToggle} 
                style={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {expanded ? 
                <CloseIcon sx={{
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                            transform: 'rotate(360deg)',
                            },
                        }}
                /> : 
                <LaunchIcon sx={{ transform: 'scaleX(-1)' }}/>}
            </Fab>
            
            <Box
                sx={{
                position: 'fixed',
                bottom: 16,
                right: expanded ? 96 : 16, 
                transition: 'right 0.3s ease', 
                backgroundColor:" rgba(255, 255, 255, 0.5)",
                boxShadow: 3,
                borderRadius: 2,
                padding: 2,
                opacity: expanded ? 1 : 0, 
                pointerEvents: expanded ? 'auto' : 'none', 
                }}
            >
                <Typography variant="h6" fontSize='0.7rem' color={'rgba(27, 27, 27, 0.821)'}>Demo app with the following credentials:</Typography>
                <Box 
                    sx={{   
                        padding:'0.5rem',
                        border:'1px solid rgba(27, 27, 27, 0.237)',
                        borderRadius:'15px',
                        margin:'0.5rem'
                    }}
                >
                    <Stack direction='row' spacing='1rem'>
                        <Typography variant="h6" fontSize='0.7rem' color={'rgba(27, 27, 27, 0.821)'}>Username: </Typography>
                        <Typography variant="body1" fontSize='0.7rem' color={'rgba(96, 95, 95, 0.821)'}>demo</Typography>
                    </Stack>
                    <Stack direction='row' spacing='1rem'>
                        <Typography variant="h6" fontSize='0.7rem' color={'rgba(27, 27, 27, 0.821)'}>Password: </Typography>
                        <Typography variant="body1" fontSize='0.7rem' color={'rgba(96, 95, 95, 0.821)'}>password</Typography>
                    </Stack>
                </Box>
            </Box>
            </Box>
            <Box> 
                <AtheniumLogo width={"100%"} />
            </Box>
            <Root sx={{ display: 'flex', flexDirection: 'column', width: "70vw", alignItems: 'center', margin: '5% 0%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <LoginForm errorMessage={errorMessage} handleLoginSuccess={handleLoginSuccess} />
                </Box>
                <Divider sx={{ width: '80%', marginY: 1, cursor: 'default', userSelect: 'none' }} orientation="horizontal" component="div" role="presentation" aria-hidden="true">
                    Or Login with
                </Divider>
                <Box sx={{ width: "20vw", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={errorMessage} useOneTap />
                </Box>
                <Box sx={{ position: 'fixed', bottom: '2vh', margin: '1rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant='body'>Don't have an account?</Typography>
                        <Button
                            onClick={() => navigate('/signup')}
                            sx={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                            Sign Up
                        </Button>
                    </Box>
                </Box>
            </Root>
        </Container>
    );
}

export default LoginPage;
