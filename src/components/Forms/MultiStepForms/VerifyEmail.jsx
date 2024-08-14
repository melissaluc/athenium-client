import { TextField, Button } from "@mui/material";
import {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function VerifyEmail ({googleOauth, email_address}) {
    const navigate = useNavigate()
    const [verificationCode, setVerificationCode] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const handleChange = (e) => {
        setVerificationCode(e.target.value)
    }

    const handleVerificationRequest = async (verificationCode, emailAddress, setSuccess = false) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/verify-email`, {
                verification_code: verificationCode,
                email_address: emailAddress
            });

            if (response.data.success) {
                if (setSuccess) {
                    setShowSuccess(true);
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    // Handle submit and resend code
    const handleSubmit = (e) => {
        e.preventDefault();
        handleVerificationRequest(verificationCode, email_address, true);
    };

    const handleResendCode = () => {
        handleVerificationRequest(verificationCode, email_address);
    };

    useEffect(()=>{
        if(googleOauth){
            setShowSuccess(true)
        }
    },[])

    return (
        <>
            {!showSuccess & !googleOauth?    
             <>
                    Verify Email
                    Check your email for verification code
                    <TextField onChange={handleChange} value={verificationCode} name='verification_code' id='verification_code'/>
                    <Button onClick={handleResendCode}>Resend</Button>
                    <Button disabled={false} onClick={handleSubmit}>Submit</Button>
                </> :
                <>
                    Success!
                    <Button onClick={()=>navigate('./login')}>Return to Log in</Button>
                </>
            }
        </>
    )
}

export default VerifyEmail;