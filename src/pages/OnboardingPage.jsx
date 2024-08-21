import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import AtheniumLogo from '../assets/AtheniumLogo';
import MultiStepForm from '../components/Forms/MultiStepForm';
import UserCredentialsSignUp from '../components/Forms/UserCredentialsSignUp';
import VerifyEmail from '../components/Forms/MultiStepForms/VerifyEmail';

const OnboardingPage = () => {
    const theme = useTheme();
    const [userCredentials, setUserCredentials] = useState(null);
    const [isComplete, setIsComplete] = useState(false)
    const [userData, setUserData] = useState({})

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(1),
        },
    }));

    
    const handleUserCredentials = (userCredFormData) => {
        setUserCredentials(userCredFormData)
    }

    const handleSuccess = (response) => {
        console.log('Success:', response);
        // Handle Google login success
    };

    const handleError = (error) => {
        console.error('Error:', error);
        // Handle Google login error
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  maxWidth:'100vw', maxHeight:'100vh', padding:'0 2vh'}}>
            <Root sx={{ display: 'flex', flexDirection: 'column', width: "70%", alignItems: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {userCredentials ? ( !isComplete?
                        <MultiStepForm userCredentials={userCredentials} setIsComplete={setIsComplete} setUserData={setUserData}/>
                        : <VerifyEmail googleOauth={userCredentials.google_id ? true : false} email_address={userCredentials.email_address} userData={userData}/>
                    ) : (
                        <>
                            <AtheniumLogo width={"100%"} />
                            <Typography textAlign='center' color={theme.palette.primary.main} variant='h6'>Start Your Journey</Typography>
                            <UserCredentialsSignUp
                                handleUserCredentials={handleUserCredentials}
                                handleSuccess={handleSuccess}
                                handleError={handleError}
                            />
                        </>
                    )}
                </Box>
            </Root>
        </Container>
    );
};

export default OnboardingPage;
