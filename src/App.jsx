import React from 'react';
import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import LogPage from './pages/LogPage';
import GoalsPage from './pages/GoalsPage';
import MeasurementPage from './pages/MeasurementsPage';
import NutritionPage from './pages/NutritionPage';
import OnboardingPage from './pages/OnboardingPage';
import TrendsPage from './pages/TrendsPage';
import WorkoutPage from './pages/WorkoutPage';
import StrengthPage from './pages/StrengthPage';
import LoginPage from './pages/LoginPage'
import { UserDataContext } from './UserDataContext';
import { useContext } from 'react';
import {UserDataProvider} from './UserDataContext';
import DrawerNavBar from './components/NavBar/DrawerNavBar/DrawerNavBar';
import { Box } from '@mui/material';

function AppRoutes ({}) {
    const { userData } = useContext(UserDataContext);
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';


    // Redirect authenticated users
    if (isLoginPage && localStorage.getItem('authToken')) {
        return <Navigate to='/dashboard' />;
    }
    if (isLoginPage) {
        return (
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
        );
    }

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
                <Route path='/onboarding' element={<OnboardingPage />} />
                <Route path='/trends' element={<TrendsPage />} />
                <Route path='/workouts' element={<WorkoutPage />} />
                <Route path='/strength' element={<StrengthPage />} />
                <Route path='*' element={<Navigate to='/dashboard' />} />
            </Routes>
        </>
    );
};

function App() {
    return (
        <BrowserRouter>
            <UserDataProvider>
                <AppRoutes />
            </UserDataProvider>
        </BrowserRouter>
    );
}

export default App;
