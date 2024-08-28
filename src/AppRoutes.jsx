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
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PageLoadingProgress from './components/Loading/Progress/PageLoadingProgress';
import DashboardHeader from './components/DashboardHeader/DashboardHeader';
import DrawerNavBar from './components/NavBar/DrawerNavBar/DrawerNavBar';
import { UserDataContext } from './Contexts/UserDataContext';
import { WorkoutProvider } from './Contexts/WorkoutContext';
import { NutritionProvider } from './Contexts/NutritionContext';
import { GoalsProvider } from './Contexts/GoalsContext';
import { UserSignUpProvider } from './Contexts/UserSignUpContext';
import { MeasurementProvider } from './Contexts/MeasurementContext';
import { Container, Box, Typography } from '@mui/material';

function AppRoutes() {
    const { userData, loading } = useContext(UserDataContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

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
    }, [location]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const isLoggedIn = userData?.first_name || !!authToken;
    
        if (!isLoggedIn && currentPath !== "/login") {
            navigate('/login');
        } else {
            setIsAuthenticated(isLoggedIn);
        }
    }, [userData]);

    if (loading) {
        return <PageLoadingProgress />;
    }

    if (isAuthenticated) {
        return (
            <Container>
                <Box 
                    sx={{
                        backgroundColor: theme.palette.primary.light,
                        borderBottomLeftRadius: '30px',
                        borderBottomRightRadius: '30px',
                        padding: '3vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        gap: '1rem'
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
                        <Typography color='primary' variant='h6' sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                            {pageNames[pageName]}
                        </Typography>
                    </Box>
                    {pageName === '/dashboard' && <DashboardHeader />}
                </Box>
                <WorkoutProvider>
                    <NutritionProvider>
                            <GoalsProvider>
                                    <MeasurementProvider>
                                        <Routes>
                                            <Route path='/settings' element={<SettingsPage />} />
                                            <Route path='/dashboard' element={<DashboardPage />} />
                                            <Route path='/goals' element={<GoalsPage />} />
                                            <Route path='/measurements' element={<MeasurementPage />} />
                                            <Route path='/nutrition' element={<NutritionPage />} />
                                            <Route path='/trends' element={<TrendsPage />} />
                                            <Route path='/workouts' element={<WorkoutPage />} />
                                            <Route path='/workouts/:id' element={<WorkoutDetailPage />} />
                                            <Route path='/strength' element={<StrengthPage />} />
                                            <Route path='*' element={<Navigate to='/dashboard' />} />
                                        </Routes>
                                    </MeasurementProvider>
                            </GoalsProvider>
                    </NutritionProvider>
                </WorkoutProvider>
            </Container>
        );
    } else {
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

}

export default AppRoutes;
