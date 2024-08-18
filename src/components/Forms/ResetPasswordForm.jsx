import React, { useState, useCallback, useEffect } from 'react';
import { Box, FormControl, InputAdornment, TextField, Button, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPasswordForm({ 
    theme, 
    handleResetComplete,
    token,
    email_address
}) {
    const [visibility, setVisibility] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [userCredentials, setUserCredentials] = useState({
        new_password: '',
        confirm_password: ''
    });

    const navigate = useNavigate();


    const validatePasswords = () => {
        const errors = {};
        if (userCredentials.new_password !== userCredentials.confirm_password) {
            errors.confirm_password = 'Passwords do not match';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const areAllFieldsFilled = () => {
        return userCredentials.new_password && userCredentials.confirm_password;
    };

    const isButtonDisabled = !areAllFieldsFilled() || !!formErrors.confirm_password;

    useEffect(() => {
        validatePasswords();
    }, [userCredentials.new_password, userCredentials.confirm_password]);

    const handleChange = useCallback((e) => {
        setUserCredentials({
            ...userCredentials,
            [e.target.name]: e.target.value
        });
    }, [userCredentials]);

    const toggleVisibility = useCallback(() => {
        setVisibility(prev => !prev);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        axios.post(`${process.env.REACT_APP_API_BASE_URL}/reset-password`, {
            action: 'reset_password',
            token: token,
            email_address: email_address,
            new_password: userCredentials.new_password
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.data.success) {
                handleResetComplete();
            } else {
                console.log('Error resetting password:', response.data.message);
    
            }
        })
        .catch(error => {
            console.error('Error sending reset password request:', error);
        });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '5vh 0' }}>
            <form onSubmit={handleSubmit}>
                <FormControl 
                    fullWidth 
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}
                >
                    <TextField
                        label='New Password'
                        autoComplete="new-password"
                        id="new_password"
                        name="new_password"
                        placeholder='New Password'
                        value={userCredentials.new_password}
                        variant="outlined"
                        required
                        type={!visibility ? "password" : "text"}
                        onChange={handleChange}
                        sx={{
                            width: '100%',
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
                            endAdornment: (
                                <InputAdornment position="end" onClick={toggleVisibility}>
                                    {!visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label='Confirm Password'
                        autoComplete="new-password"
                        id="confirm_password"
                        name="confirm_password"
                        placeholder='Confirm Password'
                        value={userCredentials.confirm_password}
                        variant="outlined"
                        required
                        type={!visibility ? "password" : "text"}
                        onChange={handleChange}
                        sx={{
                            width: '100%',
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
                            endAdornment: (
                                <InputAdornment position="end" onClick={toggleVisibility}>
                                    {!visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </InputAdornment>
                            ),
                        }}
                        helperText={formErrors.confirm_password}
                        error={!!formErrors.confirm_password}
                    />
                </FormControl>
                <Button 
                    type="submit"
                    disabled={isButtonDisabled}
                    variant="contained"
                    sx={{ marginTop: '1rem', width: "100%" }}
                >
                    Reset Password
                </Button>
            </form>
            <Button 
                sx={{ marginTop: '1rem' }}
                onClick={() => navigate('/login')}
            >
                Return to Login
            </Button>
        </Box>
    );
}

export default ResetPasswordForm;
