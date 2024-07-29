import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import DrawerNavBar from './NavBar/DrawerNavBar/DrawerNavBar'; // Update with the correct path

const Layout = () => {
    const location = useLocation();
    const shouldShowNavBar = !['/login', '/signup'].includes(location.pathname);

    return (
        <div>
            {shouldShowNavBar && (
                <Box className='mobile-nav-bar__wrapper' sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <DrawerNavBar />
                </Box>
            )}
            <Outlet />
        </div>
    );
};

export default Layout;
