import { createTheme } from '@mui/material/styles';
import {purple} from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#f1dbff',
        },
        secondary: {
            main: '#6f528a',
        },
        error: {
            main: purple.A700,
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h1: {
            fontSize: '2.2rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '1.8rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#DFD8F7',
                },
            },
        },
    },
});

export default theme;