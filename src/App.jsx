import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { BrowserRouter } from 'react-router-dom';
import { UserDataProvider } from './Contexts/UserDataContext';
import AppRoutes from './AppRoutes';
import './App.css'


function App() {
    
    return (
        <BrowserRouter>
            <UserDataProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {/* <DatePicker/> */}
                <AppRoutes />
                </LocalizationProvider>
            </UserDataProvider>
        </BrowserRouter>
    );
}

export default App;
