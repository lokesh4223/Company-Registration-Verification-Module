import React from 'react';
import { Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/userSlice';
import { toast } from 'react-toastify';

const LogoutButton = ({ variant = "contained", color = "primary", size = "medium", fullWidth = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out successfully');
    navigate('/login');
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={<Logout />}
      onClick={handleLogout}
      fullWidth={fullWidth}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;