import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import ResetPasswordForm from '../components/Forms/ResetPasswordForm';
import PasswordIcon from '@mui/icons-material/Password';




const ResetPasswordPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { token, email_address } = useParams();
    const [isComplete, setIsComplete] = useState(false);
    const [countdown, setCountdown] = useState(10);

    const Root = styled('div')(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        color: theme.palette.text.secondary,
        '& > :not(style) ~ :not(style)': {
            marginTop: theme.spacing(2),
        },
    }));


    useEffect(() => {
        if (isComplete) {
            const timer = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);
                        navigate('/login'); 
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer); 
        }
    }, [isComplete, navigate]);

    const handleResetComplete = () => {
        setIsComplete(true);
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Root sx={{ display: 'flex', flexDirection: 'column', width: "70vw", alignItems: 'center', margin: '10% 0%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {isComplete ? (
                        <>
                            <Typography variant="h4" color='black' textAlign='center'>Password changed!</Typography>
                            <PasswordIcon sx={{ fontSize: '10vh', color:theme.palette.primary.main}}/> 
                            <Typography variant="body1">Redirecting to login in {countdown} seconds...</Typography>
                            <Divider sx={{ width: '80%', marginY: 1, cursor: 'default', userSelect: 'none' }} orientation="horizontal" component="div" role="presentation" aria-hidden="true">Or click below to return to login</Divider>
                            <Button 
                                sx={{ 
                                    position: 'fixed', 
                                    bottom: '10vh',
                                    margin: '1rem' 
                                }}
                                onClick={() => navigate('/login')}>
                                Return to Login
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant='h4' textAlign='center' color='black'>Create a New Password</Typography>
                            <PasswordIcon sx={{ fontSize: '10vh', color:theme.palette.secondary.light}}/> 
                            <ResetPasswordForm
                                theme={theme}
                                handleResetComplete={handleResetComplete}
                                token={token}
                                email_address={email_address}
                            />
                        </>
                    )}
                </Box>
            </Root>
        </Container>
    );
};

export default ResetPasswordPage;
