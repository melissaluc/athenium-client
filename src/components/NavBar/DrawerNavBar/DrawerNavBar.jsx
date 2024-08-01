import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import TodayIcon from '@mui/icons-material/Today';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FlagIcon from '@mui/icons-material/Flag';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AtheniumLogo from "../../../assets/AtheniumLogo";

import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function DrawerNavBar() {
  const [state, setState] = React.useState({
    right: false,
  });

  const theme = useTheme();
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Settings', path: '../settings', icon: <SettingsIcon /> },
    { text: 'Dashboard', path: '../dashboard', icon: <DashboardIcon /> },
    { text: 'Trend', path: '../trends', icon: <TimelineIcon /> },
    { text: 'Strength', path: '../strength', icon: <AssessmentIcon /> },
    { text: 'Schedule', path: '../schedule', icon: <TodayIcon /> },
    // { text: 'Log', path: '/log', icon: <FormatListBulletedIcon /> },
    { text: 'Goals', path: '../goals', icon: <FlagIcon /> },
    { text: 'Workouts', path: '../workouts', icon: <FitnessCenterIcon /> },
    { text: 'Nutrition', path: '../nutrition', icon: <RestaurantIcon /> },
    { text: 'Measurements', path: '../measurements', icon: <SquareFootIcon /> },
  ];
  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('authToken');
    navigate('/login');
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}><MenuIcon/></Button>
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
                    backgroundColor: theme.palette.error.main,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.error.dark,
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
