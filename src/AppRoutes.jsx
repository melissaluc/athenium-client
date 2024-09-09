import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from '@mui/system';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import MeasurementPage from './pages/MeasurementsPage';
import NutritionPage from './pages/NutritionPage';
import OnboardingPage from './pages/OnboardingPage';
import TrendsPage from './pages/TrendsPage';
import WorkoutPage from './pages/WorkoutPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import StrengthPage from './pages/StrengthPage';
import ExerciseStrengthLog from './pages/ExerciseStrengthLog';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PageLoadingProgress from './components/Loading/Progress/PageLoadingProgress';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import DrawerNavBar from './components/NavBar/DrawerNavBar/DrawerNavBar';
import { UserDataContext } from './Contexts/UserDataContext';
import { WorkoutProvider } from './Contexts/WorkoutContext';
import { StrengthLevelProvider } from './Contexts/StrengthLevelContext';
import { NutritionProvider } from './Contexts/NutritionContext';
import { GoalsProvider } from './Contexts/GoalsContext';
import { UserSignUpProvider } from './Contexts/UserSignUpContext';
import { MeasurementProvider } from './Contexts/MeasurementContext';
import { Container, Box, Typography, AppBar } from '@mui/material';

function AppRoutes() {
    const {loading, isAuthenticated } = useContext(UserDataContext);

    const theme = useTheme();
    const location = useLocation();
    

    const pageNames = {
        '/settings': 'Settings',
        '/dashboard': 'Dashboard',
        '/goals': 'Goals',
        '/measurements': 'Measurements',
        '/nutrition': 'Nutrition',
        '/trends': 'Trends',
        '/workouts': 'Workouts',
        '/strength': 'Strength',
    };

    const currentPath = location.pathname;
    const pageName = Object.keys(pageNames).find(path => currentPath.startsWith(path)) || null;
    
    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
        console.log(location.pathname)
        console.log('Authenticated? ',isAuthenticated)
    }, [location]);



    if (loading) {
        return <PageLoadingProgress />;
    }

    return isAuthenticated ? (
        <AuthenticatedRoutes theme={theme} pageName={pageName} pageNameLabel={pageNames[pageName]} />
    ) : (
        <UnauthenticatedRoutes />
    );

}


function AuthenticatedRoutes({ theme, pageName, pageNameLabel }) {

        return (
            <Container maxWidth="smn" display='flex' flexDirection='column' justifyContent='center'>
                <AppBar
                    position="static"
                    sx={{
                        backgroundColor: theme.palette.primary.light,
                        borderBottomLeftRadius: '30px',
                        borderBottomRightRadius: '30px',
                        padding: '3vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        gap: '1rem',
                        elevation: 0, 
                        boxShadow: 'none', 
                        color:'black'
                    }}
                >
                    <Box className='mobile-nav-bar__wrapper'
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            backgroundColor: theme.palette.primary.light,
                            borderBottomLeftRadius: '30px',
                            borderBottomRightRadius: '30px',
                        }}
                    >
                        <DrawerNavBar />
                        {pageNameLabel && <Typography color='primary' variant='h6' sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                            {pageNameLabel}
                        </Typography>}
                    </Box>
                    {pageName === '/dashboard' && <DashboardHeader />}
                </AppBar>
                <WorkoutProvider>
                    <StrengthLevelProvider>
                    <NutritionProvider>
                            <GoalsProvider>
                                    <MeasurementProvider>
                                        <Routes>
                                            <Route path='/settings' element={<SettingsPage />} />
                                            <Route path='/dashboard' element={<DashboardPage />} />
                                            {/* <Route path='/goals' element={<GoalsPage />} /> */}
                                            <Route path='/measurements' element={<MeasurementPage />} />
                                            {/* <Route path='/nutrition' element={<NutritionPage />} /> */}
                                            <Route path='/trends' element={<TrendsPage />} />
                                            <Route path='/workouts' element={<WorkoutPage />} />
                                            <Route path='/workouts/:id' element={<WorkoutDetailPage />} />
                                            <Route path='/strength' element={<StrengthPage />} />
                                            <Route path='/strength/:exercise_name' element={<ExerciseStrengthLog/>} />
                                            <Route path='*' element={<Navigate to='/dashboard' />} />
                                        </Routes>
                                    </MeasurementProvider>
                            </GoalsProvider>
                    </NutritionProvider>
                    </StrengthLevelProvider>
                </WorkoutProvider>
            </Container>
        );
    }

function UnauthenticatedRoutes() {
        return (
            <UserSignUpProvider>
                <Routes>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/signup' element={<OnboardingPage />} />
                    <Route path="/reset-password/:token/:email_address" element={<ResetPasswordPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path='*' element={<Navigate to='/login' />} />
                </Routes>
            </UserSignUpProvider>
        );

}



export default AppRoutes;
