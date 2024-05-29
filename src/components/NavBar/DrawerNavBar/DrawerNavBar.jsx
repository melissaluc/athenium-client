import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
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
import AtheniumLogo from "../../../assets/AtheniumLogo"

import { Link } from 'react-router-dom';

export default function DrawerNavBar() {
  const [state, setState] = React.useState({
    right: false,
  });

  const menuItems = [
    { text: 'Settings', path: '../settings', icon: <SettingsIcon /> },
    { text: 'Dashboard', path: '../dashboard', icon: <DashboardIcon /> },
    { text: 'Trend', path: '../trends', icon: <TimelineIcon /> },
    { text: 'Strength', path: '../strength', icon: <AssessmentIcon /> },
    { text: 'Schedule', path: '../schedule', icon: <TodayIcon /> },
    { text: 'Log', path: '../log', icon: <FormatListBulletedIcon /> },
    { text: 'Goals', path: '../goals', icon: <FlagIcon /> },
    { text: 'Workouts', path: '../workouts', icon: <FitnessCenterIcon /> },
    { text: 'Nutrition', path: '../nutrition', icon: <RestaurantIcon /> },
    { text: 'Measurements', path: '../measurements', icon: <SquareFootIcon /> }
  ];

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
              sx={{ width: '250px' }}
              role="presentation"
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              <List>
                {menuItems.map((menuItem, index) => (
                  <ListItem key={menuItem.text} disablePadding>
                    <ListItemButton component={Link} to={menuItem.path}>
                      <ListItemIcon>
                        {menuItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={menuItem.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};
