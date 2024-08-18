import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import AtheniumLogo from '../assets/AtheniumLogo';
import ResetPasswordForm from '../components/Forms/ResetPasswordForm';

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
                    <AtheniumLogo width={"100%"} />
                    {isComplete ? (
                        <>
                            <Typography variant="h5">Password changed successfully!</Typography>
                            <Typography variant="body1">Returning to login in {countdown} seconds...</Typography>
                            <Button variant="contained" sx={{ marginTop: '1rem' }} onClick={() => navigate('/login')}>
                                Return to Login Now
                            </Button>
                        </>
                    ) : (
                        <ResetPasswordForm
                            theme={theme}
                            handleResetComplete={handleResetComplete}
                            token={token}
                            email_address={email_address}
                        />
                    )}
                </Box>
            </Root>
        </Container>
    );
};

export default ResetPasswordPage;
