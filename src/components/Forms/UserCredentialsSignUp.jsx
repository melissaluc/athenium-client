import React, { useState, useCallback, useEffect } from 'react';
import { Box, FormControl, InputAdornment, TextField, Divider, Button } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function UserCredentialsSignUp({ 
    theme, 
    handleSuccess, 
    handleError, 
    handleUserCredentials 
}) {
    const [visibility, setVisibility] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [userCredentials, setUserCredentials] = useState({
        username: '',
        password: '',
        email_address:'',
        confirm_password: ''
    });

    const navigate = useNavigate()
       const validatePasswords = () => {
        const errors = {};
        if (userCredentials.password !== userCredentials.confirm_password) {
            errors.confirm_password = 'Passwords do not match';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const areAllFieldsFilled = () => {
        return userCredentials.username && userCredentials.password && userCredentials.confirm_password;
    };

    const isButtonDisabled = !areAllFieldsFilled() || !!formErrors.confirm_password;

    useEffect(() => {
        validatePasswords();
    }, [userCredentials.password, userCredentials.confirm_password]);

    const handleChange = (e) => {
        setUserCredentials({
            ...userCredentials,
            [e.target.name]: e.target.value
        });
    };
    
    const toggleVisibility = useCallback(() => {
        setVisibility(prev => !prev);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`,{action:'checkUsername', username:userCredentials.username, email_address:userCredentials.email_address}, 
            {
            headers: { 'Content-Type': 'application/json', },
            })
            .then(response => {
                if(response.data.success){
                    handleUserCredentials(userCredentials)
                } else {
                    console.log('error')
                }
            })
            .catch(error=>console.error(error))
    }


    const verifyToken = async (idToken) => {
        try {
            const response = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
                params: {
                    id_token: idToken
                }
            });
            return {success:true, token:response.data}
        } catch (error) {
            console.error('Token verification error:', error.response ? error.response.data : error.message);
        }
    };
    

     // Get google cred
    const handleGoogleSignUp = async (response) => {
        // const accessToken = response.credential
        // const tokenVerified= verifyToken(accessToken)

        if(response){
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/google/signup`, {
                    token: response.credential,
                }, {
                    headers: { 
                        'Content-Type': 'application/json',
                        // Authorization: `Bearer ${accessToken}`
                    },
                });
                if (res.data.success) {
                    handleUserCredentials(
                        res.data.user)
                }
            } catch (error) {
                console.error('Google signup error:', error);
            }
        }
    };
   

    

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin:'5vh 0'}}>
            <form>
                <FormControl 
                    fullWidth 
                    sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'}}
                >
                    <TextField
                        label='Username'
                        autoComplete="username"
                        id="username"
                        name="username"
                        placeholder='Username'
                        value={userCredentials.username}
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
                    />
                    <TextField
                        label='Email Address'
                        autoComplete="email_address"
                        id="email_address"
                        name="email_address"
                        placeholder='Email Address'
                        value={userCredentials.email_address}
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
                    />
                    <TextField
                        label='Password'
                        autoComplete="new-password"
                        id="password"
                        name="password"
                        placeholder='Password'
                        value={userCredentials.password}
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
                    />
                </FormControl>
                <Button 
                    disabled={isButtonDisabled}
                    onClick={handleSubmit} 
                    variant="contained"
                    onSuccess={handleSubmit} 
                    onError={handleError}
                    sx={{
                        marginTop:'1rem', 
                        width:"100%"}}
                    >Next</Button>
            </form>
            <Divider sx={{ width: '90%', marginY: '2rem', cursor: 'default', userSelect: 'none' }} orientation="horizontal">Or Sign Up With</Divider>
            <Box sx={{ width: "20vw", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleLogin
                    text="continue_with"
                    onSuccess={handleGoogleSignUp}
                    onError={handleError}
                    useOneTap
                    scope="profile email"
                />
            </Box>
            <Button onClick={()=>navigate('/login')}>Return to Login</Button>
        </Box>
    );
}

export default UserCredentialsSignUp;


