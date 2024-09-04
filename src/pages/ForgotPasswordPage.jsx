import React, {useContext, useState} from 'react';
import { Box, Container, Typography, Divider, Button } from '@mui/material';
import AtheniumLogo from '../assets/AtheniumLogo';
import ForgotPasswordForm from '../components/Forms/ForgotPasswordForm';

function ForgotPasswordPage() {


    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth:'smn'}}>
            <ForgotPasswordForm />
        </Container>
    );
}

export default ForgotPasswordPage;
