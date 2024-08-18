import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import GoalsPage from './pages/GoalsPage';
import MeasurementPage from './pages/MeasurementsPage';
import NutritionPage from './pages/NutritionPage';
import OnboardingPage from './pages/OnboardingPage';
import TrendsPage from './pages/TrendsPage';
import WorkoutPage from './pages/WorkoutPage';
import StrengthPage from './pages/StrengthPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { UserDataContext } from './UserDataContext';
import DrawerNavBar from './components/NavBar/DrawerNavBar/DrawerNavBar';
import { Box } from '@mui/material';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function AppRoutes() {
    const { userData } = useContext(UserDataContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const isLoggedIn = Object.entries(userData).length > 0 || !!authToken;
        console.log('Object.entries(userData).length > 0: ', Object.entries(userData).length > 0)
        console.log('Is Logged in? ',isLoggedIn)
        console.log('userData? ',userData)
        setIsAuthenticated(isLoggedIn);
        console.log('Is authenticated? ',isAuthenticated)
    }, [userData]);

    if (isAuthenticated) {
        return (
            <>
                <Box className='mobile-nav-bar__wrapper' sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <DrawerNavBar />
                </Box>
                <Routes>
                    <Route path='/dashboard' element={<DashboardPage />} />
                    <Route path='/schedule' element={<SchedulePage />} />
                    <Route path='/goals' element={<GoalsPage />} />
                    <Route path='/measurements' element={<MeasurementPage />} />
                    <Route path='/nutrition' element={<NutritionPage />} />
                    <Route path='/trends' element={<TrendsPage />} />
                    <Route path='/workouts' element={<WorkoutPage />} />
                    <Route path='/strength' element={<StrengthPage />} />
                    <Route path='*' element={<Navigate to='/dashboard' />} />
                </Routes>
            </>
        );
    }

    return (
        <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<OnboardingPage />} />
            <Route path="/reset-password/:token/:email_address" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
    );
}

export default AppRoutes;
