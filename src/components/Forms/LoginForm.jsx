
import { Box, TextField,FormControl, InputAdornment, Link, Button } from "@mui/material"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/Lock';
import {useTheme} from "@mui/material";
import {useState} from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";


function LoginForm({errorMessage, handleLoginSuccess, setForgotPassword}){
    const theme = useTheme()
    const navigate = useNavigate()
    const [visibility, setVisibility] = useState(false)
    const [formData, setFormData] = useState({
        username:'',
        password:''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLoginSuccess(formData);
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password')
    };


    return(
        <form onSubmit={handleSubmit}>
            <FormControl 
                fullWidth 
                sx={{display:'flex', flexDirection:'column', gap:'0.8rem', alignItems:'center'}}>
                <TextField
                    autoComplete="username"
                    id="username"
                    name="username"
                    placeholder='Username'
                    value={formData.username}
                    variant="outlined"
                    required
                    onChange={handleChange}
                    sx={{
                        width:'100%',
                        backgroundColor:'light blue',
                        borderRadius: 2,
                        '& .MuiInputBase-input': {
                            borderRadius: 2,
                        },
                        '& .MuiInputBase-root': {
                            '&:hover fieldset': {
                                borderColor: `${theme.palette.primary.main}`, // Change border color on hover
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                        <PersonOutlineIcon/>
                        </InputAdornment>
                    ),
                    }}
                    />
                <TextField
                    autoComplete="current-password"
                    id="password"
                    name="password"
                    placeholder='Password'
                    value={formData.password}
                    variant="outlined"
                    required
                    type={!visibility ? "password" : "text"}
                    onChange={handleChange}
                    sx={{
                        width:'100%',
                        borderRadius: 2,
                        '& .MuiInputBase-input': {
                            borderRadius: 2,
                        },
                        '& .MuiInputBase-root': {
                            '&:hover fieldset': {
                                borderColor: `${theme.palette.primary.main}`, // Change border color on hover
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon /> 
                        </InputAdornment>
                    ),
                        endAdornment: (
                        <InputAdornment position="start" onClick={()=>{setVisibility(prev => !prev)}}>
                            {!visibility  ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </InputAdornment>
                    ),
                    }}
                />
                        <Link
                        // alignSelf='flex-end'
                        href="#"
                        variant="body2"
                        sx={{ cursor: 'pointer', textDecoration: 'none' }}
                        onClick={handleForgotPassword}
                        >
                        Forgot Password?
                        </Link>
            </FormControl>
            <Button 
                onClick={handleSubmit} 
                variant="contained"
                onSuccess={handleSubmit} 
                onError={errorMessage}
                sx={{
                    marginTop:'1rem', 
                    width:"100%"}}
                >Login</Button>
        </form>

    )
}

export default LoginForm