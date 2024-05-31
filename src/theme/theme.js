// theme.js
import { createTheme } from '@mui/material/styles';



const theme = createTheme({
typography: {
    fontFamily: 'Poppins,  sans-serif',
    },
  palette: {
    primary: {
      main: '#776dde',
    },
    secondary: {
      main: '#F3F0FB',
    },
    progress: {
      level1: '#F4D35E', // Yellow
      level2: '#E09DAD', // Pink
      level3: '#BDB2FF', // Light Purple
      level4: '#9A4C95', // Purple
      level5: '#00F5D4', // Green
    },
    macros:{
      protein:"#ed254e",
      carbs:"#4dccbd",
      fat:"#f9dc5c"
    }
  },
  breakpoints: {
    values:{
        xs:0,
        smn: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Poppins'), local('Poppins-Regular'), url('/Poppins-Regular.ttf') format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

export default theme;