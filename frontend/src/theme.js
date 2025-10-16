import { createTheme } from '@mui/material/styles';

// Custom color palette
const palette = {
  primary: {
    main: '#667eea',
    light: '#7f9cf5',
    dark: '#5a6fd8',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#764ba2',
    light: '#8a6bbe',
    dark: '#6a4190',
    contrastText: '#ffffff'
  },
  success: {
    main: '#10b981',
    light: '#3ac69f',
    dark: '#0d9c6d',
    contrastText: '#ffffff'
  },
  warning: {
    main: '#f59e0b',
    light: '#f7ad3d',
    dark: '#d98b0a',
    contrastText: '#ffffff'
  },
  error: {
    main: '#ef4444',
    light: '#f36a6a',
    dark: '#d23a3a',
    contrastText: '#ffffff'
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff'
  },
  text: {
    primary: '#334155',
    secondary: '#64748b',
    disabled: '#94a3b8'
  }
};

// Typography
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.2
  },
  h3: {
    fontWeight: 700,
    fontSize: '1.75rem',
    lineHeight: 1.2
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.3
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.3
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: 1.3
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  button: {
    fontWeight: 600,
    fontSize: '0.875rem',
    textTransform: 'none'
  }
};

// Spacing scale
const spacing = (factor) => `${0.25 * factor}rem`;

// Breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  }
};

// Components customization
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 600,
        padding: '0.75rem 1.5rem',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none'
        }
      },
      contained: {
        boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
      },
      outlined: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px'
        }
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
      },
      rounded: {
        borderRadius: '12px'
      }
    }
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px'
        }
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }
    }
  }
};

// Create the theme
const theme = createTheme({
  palette,
  typography,
  spacing,
  breakpoints,
  components
});

// Custom theme extensions
theme.custom = {
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
  },
  shadows: {
    soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
    medium: '0 6px 16px rgba(0, 0, 0, 0.1)',
    strong: '0 10px 25px rgba(0, 0, 0, 0.15)'
  }
};

export default theme;