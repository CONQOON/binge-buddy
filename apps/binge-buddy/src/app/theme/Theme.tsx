import { createTheme } from '@mui/material/styles';

const colors = {
  primary: {
    main: '#E50914',
    dark: '#B2070F',
  },
  secondary: {main: '#000000'},
  background: {
    default: '#000000',
    paper: '#141414',
  },
};

const typography = {
  fontFamily: 'Arial, sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.1,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },
};

const spacing = 8;

const shadows = {
  MuiPaper: {
    elevation3: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

const zIndex = {
  searchBar: 1200,
};

export const theme = createTheme({
  palette: {
    ...colors,
    text: {
      primary: '#fff', // Set the default text color to white
    }
  },
  typography: {
    fontFamily: typography.fontFamily,
    h1: {...typography.h1},
    h2: {...typography.h2},
  },
  spacing,
  components: {},
  zIndex: {
    appBar: 1200,
  }
});

export default theme;
