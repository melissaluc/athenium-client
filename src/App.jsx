import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'

import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ResultsPage from './pages/ResultsPage';
import GoalsPage from './pages/GoalsPage';
import MeasurementPage from './pages/MeasurementsPage';
import NutritionLog from './pages/NutritionLog';
import OnboardingPage from './pages/OnboardingPage';
import TrendsPage from './pages/TrendsPage';
import WorkoutLogPage from './pages/WorkoutLogPage';


function App(){

    return(
        <>

        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage/>}  />
                <Route path='/dashboard' element={<HomePage/>}  />
                <Route path='/schedule' element={<SchedulePage/>}  />
                <Route path='/results' element={<ResultsPage/>}  />
                <Route path='/goals' element={<GoalsPage/>}  />
                <Route path='/measurements' element={<MeasurementPage/>}  />
                <Route path='/nutrition' element={<NutritionLog/>}  />
                <Route path='/onboarding' element={<OnboardingPage/>}  />
                <Route path='/trends' element={<TrendsPage/>}  />
                <Route path='/workout-log' element={<WorkoutLogPage/>}  />
            </Routes>
        </BrowserRouter>

        </>

    )
}

export default App;