import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { googleLogout } from '@react-oauth/google';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import FlagIcon from '@mui/icons-material/Flag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import AppsIcon from '@mui/icons-material/Apps';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AtheniumLogo from "../../../assets/AtheniumLogo";
import {UserDataContext} from '../../../Contexts/UserDataContext'
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';




function DrawerNavBar() {
  const {setUserData, setIsDataFetched, setIsAuthenticated} = useContext(UserDataContext)
  const [state, setState] = useState({
    right: false,
    left: false,
  });

  const theme = useTheme();
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Settings', path: '../settings', icon: <SettingsIcon /> },
    { text: 'Dashboard', path: '../dashboard', icon: <DashboardIcon /> },
    { text: 'Trend', path: '../trends', icon: <TimelineIcon /> },
    { text: 'Strength', path: '../strength', icon: <AssessmentIcon /> },
    // { text: 'Schedule', path: '../schedule', icon: <TodayIcon /> },
    // { text: 'Log', path: '/log', icon: <FormatListBulletedIcon /> },
    // { text: 'Goals', path: '../goals', icon: <FlagIcon /> },
    { text: 'Workouts', path: '../workouts', icon: <FitnessCenterIcon /> },
    // { text: 'Nutrition', path: '../nutrition', icon: <RestaurantIcon /> },
    { text: 'Measurements', path: '../measurements', icon: <SquareFootIcon /> },
  ];

  
  const handleLogout = async () => {
    try {
      localStorage.removeItem('authToken');
      setUserData(null);
      setIsDataFetched(false);
      setIsAuthenticated(false);

      // Sign out from Google
      googleLogout();

      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };


  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton sx={{
            '& .MuiSvgIcon-root': {
              fontSize: '5vh', 
        },
      }} color='primary' onClick={toggleDrawer(anchor, true)}><AppsIcon/></IconButton>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <Box sx={{padding:"1rem 0rem 1.5rem 1rem"}}>
              <AtheniumLogo width='200px'/>
            </Box>
            <Box
              sx={{ 
                width: '250px', 
                display: 'flex', 
                flexDirection:'column',
                justifyContent:'space-between',
                flex: 1, 
              }}
              role="presentation"
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <List>
                {menuItems.map((menuItem, index) => (
                  <ListItem key={menuItem.text} disablePadding
                  >
                    <ListItemButton
                      component={Link}
                      to={menuItem.path}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        {menuItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={menuItem.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Box sx={{ padding: '1rem' }}>
                <Button
                  onClick={handleLogout}
                  sx={{
                    width: '100%',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.cyan,
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default DrawerNavBar;