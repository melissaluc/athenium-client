// theme.js
import { createTheme } from '@mui/material/styles';



const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Default font for body text
    h1: {
      fontFamily: 'Silkscreen, Arial, sans-serif', // Specific font for headers if needed
    },
    h2: {
      fontFamily: 'Silkscreen, Arial, sans-serif', // Specific font for headers if needed
    },
    h3: {
      fontFamily: 'Silkscreen, Arial, sans-serif', // Specific font for headers if needed
    },
    h4: {
      fontFamily: 'Silkscreen, Arial, sans-serif', // Silkscreen font for h4 variant
    },
    h5: {
      fontFamily: 'Silkscreen, Arial, sans-serif', // Silkscreen font for h4 variant
    },
    h6: {
      fontFamily: 'Silkscreen, Arial, sans-serif', // Silkscreen font for h4 variant
    },
    // You can specify more variants as needed
  },
  palette: {
    primary: {
      main: '#9B6EDE',
    },
    secondary: {
      main: '#F3F0FB',
      light:'#D8D8D8'
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
    },
    measurements:{
      neck:'#1f77b4',
      shoulder:'#ff7f0e',
      chest: '#2ca02c',
      abdomen: '#d62728',
      waist: '#9467bd',
      hip:'#8c564b',
      rbicep: '#e377c2',
      lbicep: '#e377c2',
      lupperthigh:'#bcbd22',
      rupperthigh:'#bcbd22',
      rthigh:'#f5d76e',
      lthigh:'#f5d76e',
      lcalf: '#17becf',
      rcalf: '#17becf' 
    },
    body_composition:{
      weight:'#3498db',
      body_fat:'#e74c3c',
      lean_muscle_mass:'#2ecc71',
      bmi:'#9b59b6',
      weight_diff:'#3498db',
      body_fat_diff:'#e74c3c',
      lean_muscle_mass_diff:'#2ecc71',
      bmi_diff:'#9b59b6'
    }
    ,
    strength:{
      Chest:"#B30000",
      Legs:"#004D99",
      "Whole Body":"#008000",
      Shoulders:"#CCCCCC",
      Back:"#006400",
      Biceps:"#FFA500",
      Triceps:"#800080",
      Core:"#FFFF00",
      Forearms:"#8B4513"
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
          font-family: 'Roboto';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Roboto'), local('Roboto-Regular'), url('/Roboto-Regular.ttf') format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Silkscreen, Arial, sans-serif', // Apply Silkscreen to buttons
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto, Arial, sans-serif', // Apply Roboto to FormLabel
          fontWeight: 'bold', // Make the FormLabel text bold
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto, Arial, sans-serif', // Ensure InputLabel uses Roboto
          fontWeight: 'normal', // Keep the InputLabel text normal weight
        },
      },
    },
    
  },
});

export default theme;


