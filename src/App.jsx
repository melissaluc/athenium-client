import { useEffect, useState } from 'react';
import { LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { BrowserRouter } from 'react-router-dom';
import { UserDataProvider } from './Contexts/UserDataContext';
import AppRoutes from './AppRoutes';
import PageLoadingProgress from './components/Loading/Progress/PageLoadingProgress';
import './App.css'


function App() {
    const [isApiAwake, setIsApiAwake] = useState(false);

    useEffect(() => {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        if (!apiBaseUrl) {
            console.error('REACT_APP_API_BASE_URL is not configured; cannot wake the API.');
            return undefined;
        }

        let retryTimer;
        let requestController;
        let retryDelay = 2000;
        let isActive = true;

        const wakeApi = async () => {
            requestController = new AbortController();
            const timeout = window.setTimeout(() => requestController.abort(), 10000);

            try {
                const response = await fetch(apiBaseUrl, {
                    method: 'GET',
                    signal: requestController.signal
                });

                if (response.status >= 500) {
                    throw new Error(`API returned status ${response.status}`);
                }

                if (isActive) {
                    setIsApiAwake(true);
                }
            } catch (error) {
                if (!isActive) {
                    return;
                }

                console.warn('API wake-up request failed; retrying.', error);
                retryTimer = window.setTimeout(wakeApi, retryDelay);
                retryDelay = Math.min(retryDelay * 2, 30000);
            } finally {
                window.clearTimeout(timeout);
            }
        };

        wakeApi();

        return () => {
            isActive = false;
            window.clearTimeout(retryTimer);
            requestController?.abort();
        };
    }, []);

    if (!isApiAwake) {
        return <PageLoadingProgress />;
    }

    return (
        <BrowserRouter>
            <UserDataProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AppRoutes />
                </LocalizationProvider>
            </UserDataProvider>
        </BrowserRouter>
    );
}

export default App;
