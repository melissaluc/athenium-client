import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import ResultsPage from './pages/ResultsPage';
import LogPage from './pages/LogPage';
import GoalsPage from './pages/GoalsPage';
import MeasurementPage from './pages/MeasurementsPage';
import NutritionPage from './pages/NutritionPage';
import OnboardingPage from './pages/OnboardingPage';
import TrendsPage from './pages/TrendsPage';
import WorkoutPage from './pages/WorkoutPage';
import StrengthPage from './pages/StrengthPage';

import DrawerNavBar from './components/NavBar/DrawerNavBar/DrawerNavBar';

import { Box } from '@mui/material';

function App(){

    return(
        <div className='App'>
            <BrowserRouter>
                <Box className='mobile-nav-bar__wrapper' sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <DrawerNavBar />
                </Box>
                <Routes>
                    <Route path='/' element={<DashboardPage/>}  />
                    <Route path='/dashboard' element={<DashboardPage/>}  />
                    <Route path='/schedule' element={<SchedulePage/>}  />
                    {/* <Route path='/log' element={<LogPage/>}  /> */}
                    <Route path='/goals' element={<GoalsPage/>}  />
                    <Route path='/measurements' element={<MeasurementPage/>}  />
                    <Route path='/nutrition' element={<NutritionPage/>}  />
                    <Route path='/onboarding' element={<OnboardingPage/>}  />
                    <Route path='/trends' element={<TrendsPage/>}  />
                    <Route path='/workouts' element={<WorkoutPage/>}  />
                    <Route path='/strength' element={<StrengthPage/>}  />
                </Routes>
            </BrowserRouter>
        </div>



    )
}

export default App;