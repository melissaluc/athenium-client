import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserDataProvider } from './Contexts/UserDataContext';
import AppRoutes from './AppRoutes';

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
