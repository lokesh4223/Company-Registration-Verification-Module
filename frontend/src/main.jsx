import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import store from './store'
import { restoreAuthState } from './store/userSlice'
import './index.css'
import App from './app.jsx'
import theme from './theme'

// Restore authentication state from localStorage
store.dispatch(restoreAuthState());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)