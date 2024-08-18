import React, { useState } from 'react';
import { Box, TextField, FormControl, InputAdornment, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordForm({}) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [emailAddress, setEmailAddress] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setEmailAddress(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/reset-password`, {
            email_address: emailAddress,
            action: 'reset_password_request'
        })
        .then(response => {
            if (response.data.success) {
                setSuccess(true);
            }
        })
        .catch(error => {
            console.error('Error sending reset password request:', error);
            // You may want to handle error messages here
        });
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form onSubmit={handleSubmit}>
                {
                    success ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3">Reset Link Sent to Your Email</Typography>
                            <Typography>You can close this page and follow the link provided in the email.</Typography>
                            <Typography>If you haven't received the link, click below to resend.</Typography>
                        </Box>
                    ) : (
                        <FormControl 
                            fullWidth 
                            sx={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                            <Typography variant='h4' sx={{ margin: '2rem', cursor: 'default', userSelect: 'none' }}>Forgot Password?</Typography>
                            <TextField
                                autoComplete="email"
                                id="email_address"
                                name="email_address"
                                placeholder='Email Address'
                                value={emailAddress}
                                variant="outlined"
                                required
                                onChange={handleChange}
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'lightblue',
                                    borderRadius: 2,
                                    '& .MuiInputBase-input': {
                                        borderRadius: 2,
                                    },
                                    '& .MuiInputBase-root': {
                                        '&:hover fieldset': {
                                            borderColor: `${theme.palette.primary.main}`,
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    )
                }
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ marginTop: '1rem', width: '100%' }}>
                    {success ? 'Resend' : 'Send'}
                </Button>
            </form>
            <Button 
                sx={{ marginTop: '1rem' }}
                onClick={() => navigate('/login')}>
                Return to Login
            </Button>
        </Box>
    );
}

export default ForgotPasswordForm;
