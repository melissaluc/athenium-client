import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

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
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout'
import { UserDataContext } from './UserDataContext';
import {useContext} from 'react'

import DrawerNavBar from './components/NavBar/DrawerNavBar/DrawerNavBar';

import { Box } from '@mui/material';

function App(){
    
    const {userData, setUserData }= useContext(UserDataContext);
    return(
        <div className='App'>

            <Routes>
                    <Route path='/' element={<Navigate to={userData.user_id ? '/dashboard' : '/login'} />} />
                    <Route element={<Layout />}>
                        <Route path='/dashboard' element={<DashboardPage />} />
                        <Route path='/schedule' element={<SchedulePage />} />
                        {/* <Route path='/log' element={<LogPage />} /> */}
                        <Route path='/goals' element={<GoalsPage />} />
                        <Route path='/measurements' element={<MeasurementPage />} />
                        <Route path='/nutrition' element={<NutritionPage />} />
                        <Route path='/onboarding' element={<OnboardingPage />} />
                        <Route path='/trends' element={<TrendsPage />} />
                        <Route path='/workouts' element={<WorkoutPage />} />
                        <Route path='/strength' element={<StrengthPage />} />
                        <Route path='/login' element={<LoginPage />} />
                    </Route>
                </Routes>
        </div>



    )
}

export default function AppContainer () {
    
    return (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
}
