import React, { useState, useRef, useEffect } from 'react';
import { 
  Avatar, 
  Box, 
  Button, 
  Divider, 
  ListItemIcon, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Typography 
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Settings as SettingsIcon, 
  Dashboard as DashboardIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/userSlice';
import { toast } from 'react-toastify';

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out successfully');
    navigate('/login');
    handleClose();
  };
  
  const handleProfile = () => {
    navigate('/dashboard/profile');
    handleClose();
  };
  
  const handleDashboard = () => {
    navigate('/dashboard');
    handleClose();
  };
  
  const handleSettings = () => {
    navigate('/dashboard/settings');
    handleClose();
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'U';
  };
  
  return (
    <>
      <Tooltip title="Account settings">
        <Button
          onClick={handleClick}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textTransform: 'none',
            borderRadius: '20px',
            px: 1.5,
            py: 0.5,
            minWidth: 0,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              fontSize: '0.875rem',
              bgcolor: '#667eea'
            }}
          >
            {getUserInitials()}
          </Avatar>
          {user?.full_name && (
            <Typography 
              variant="body2" 
              sx={{ 
                ml: 1, 
                color: '#333', 
                display: { xs: 'none', md: 'block' },
                fontWeight: 500
              }}
            >
              {user.full_name.split(' ')[0]}
            </Typography>
          )}
        </Button>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, maxWidth: 200 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.full_name || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        <MenuItem onClick={handleDashboard}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileDropdown;