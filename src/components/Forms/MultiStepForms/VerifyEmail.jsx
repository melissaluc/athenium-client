import { TextField, Button, Typography, Box, Divider } from "@mui/material";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function VerifyEmail({ googleOauth, email_address, userData }) {
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleResendCode = () => {
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/verify-email`, {
            action: 'resend_code',
            email_address,
            userData:userData
        })
        .then(response => {
            if (response.data.success) {
                console.log('Verification code resent');
            } else {
                console.error('Failed to resend code');
            }
        })
        .catch(error => console.error('Error resending code:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/verify-email`, {
            action: 'verify_email',
            verification_code: verificationCode,
            userData:userData,
            email_address
        })
        .then(response => {
            if (response.data.success) {
                setShowSuccess(true);
            } else {
                console.error('Verification failed');
            }
        })
        .catch(error => console.error('Error verifying code:', error));
    };

    useEffect(() => {
        if (googleOauth) {
            setShowSuccess(true);
        }
    }, [googleOauth]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, width:'80%' }}>
            {!showSuccess && !googleOauth ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography textAlign='center' variant='h4' color='black' paddingBottom='2vh'>Verify Email</Typography>
                    <Typography>We sent a verification code to your email : {email_address}</Typography>
                    <TextField
                        onChange={handleChange}
                        value={verificationCode}
                        name='verification_code'
                        id='verification_code'
                        placeholder="Enter Code"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2, width:'100%' }}
                    >
                        Verify
                    </Button>
                     <Divider sx={{ width: '90%', marginY: '1rem', cursor: 'default', userSelect: 'none' }} orientation="horizontal">Didn't receive the code?</Divider>
                     <Typography>Click below to resend the code to the email you used to sign up.</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleResendCode}
                        sx={{ mt: 2, width:'100%' }}
                    >
                        Resend Code
                    </Button>
                </Box>
            ) : (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography textAlign='center' variant='h4' color='black' paddingBottom='2vh'>Success!</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, width:'100%' }}
                        onClick={() => navigate('/login')}
                    >
                        Return to Log In
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default VerifyEmail;
