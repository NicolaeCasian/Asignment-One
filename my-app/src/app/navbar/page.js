'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';

// Define navigation pages with their names and paths
const pages = [
  { name: 'Home', path: '/' },
  { name: 'Login', path: '/login' },
  { name: 'Shopping Cart', path: '/shopping_cart' },
];

// The ResponsiveAppBar component
const ResponsiveAppBar = () => {
  // State for controlling navigation and user menus
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [weather, setWeatherData] = useState(null); // Stores weather data
  const [loadingWeather, setLoadingWeather] = useState(true); // Indicates weather data loading status
  const router = useRouter(); // Handles navigation programmatically

  // Opens the navigation menu
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);

  // Opens the user menu
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

  // Closes the navigation menu
  const handleCloseNavMenu = () => setAnchorElNav(null);

  // Closes the user menu
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Fetch weather data on mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/getWheater');
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, []);

  // Handles the logout function by fetching the delete method from session api
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/sessions', { method: 'DELETE' });
      if (response.ok) {
        console.log('Session deleted successfully');
        router.push('/login'); // Redirect to the login page
      } else {
        console.error('Failed to delete session');
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error.message);
      alert('An error occurred during logout. Please try again.');
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        
          <DonutSmallIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

          
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Krispy Kreme
          </Typography>

        
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link href={page.path} passHref>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

         
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.name} href={page.path} passHref>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>

          {/* Weather API */}
          <Typography sx={{ marginLeft: 2 }}>
            {loadingWeather
              ? 'Loading weather...'
              : weather
              ? `Today's temperature: ${weather.temp}°C`
              : 'Weather unavailable'}
          </Typography>

          {/* User Avatar and Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};


export default function Page() {
  return <ResponsiveAppBar />;
}
