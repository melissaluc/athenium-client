import React, {useContext, useState, useEffect} from 'react';
import { Box, Container, Typography, Divider, Button } from '@mui/material';
import AtheniumLogo from '../assets/AtheniumLogo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm';
import { styled } from '@mui/material/styles';
import { GoogleLogin } from '@react-oauth/google';
import { UserDataContext } from '../UserDataContext';


function LoginPage() {
    const navigate = useNavigate();
    const { userData, updateUserData } = useContext(UserDataContext);

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));

    const handleLoginSuccess = async (response) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, response, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('login Success: ',res.data.success)
            if (res.data.success) {
                localStorage.setItem('authToken', res.data.token);
                console.log('login Success: ',Object.keys(userData))
                await updateUserData(() => {
                  if (Object.keys(userData).length > 0) {
                      navigate('/dashboard');
                  }
              });
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
                console.log(`Login success: ${res.data.success}`)
                localStorage.setItem('authToken', res.data.token);
                await updateUserData(() => {
                  if (Object.keys(userData).length > 0) {
                      navigate('/dashboard');
                  }
              });
                console.log(`UserData set? : ${Object.entries(userData).length > 0}`)
            }
        } catch (error) {
            console.error('Google login error:', error);
        }
    };

    useEffect(()=>{
        if (Object.keys(userData).length > 0) {
            navigate('/dashboard');
        }
    },[userData])


    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box>
                <AtheniumLogo width={"100%"} />
            </Box>
                <Root sx={{ display: 'flex', flexDirection: 'column', width: "70vw", alignItems: 'center', margin: '10% 0%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant='h4' sx={{ margin: '2rem', cursor: 'default', userSelect: 'none' }}>Login</Typography>
                        <LoginForm errorMessage={errorMessage} handleLoginSuccess={handleLoginSuccess}/>
                    </Box>
                    <Divider sx={{ width: '90%', marginY: 2, cursor: 'default', userSelect: 'none' }} orientation="horizontal" component="div" role="presentation" aria-hidden="true">Or Login with</Divider>
                    <Box sx={{ width: "20vw", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={errorMessage} useOneTap />
                    </Box>
                    <Button
                        onClick={() => navigate('/signup')}
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                        Sign Up
                    </Button>
                </Root>
            <Box>
            </Box>
        </Container>
    );
}

export default LoginPage;
