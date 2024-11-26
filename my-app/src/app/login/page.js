'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(2),
  justifyContent: 'center',
}));

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(null); // Manage session state
  const router = useRouter();

  // Check session on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/sessions', { credentials: 'include' });
        const data = await res.json();

        if (res.ok && data.loggedIn) {
          console.log('Session data:', data.session); // Debugging log
          setSession(data.session); // Save the session in state
          router.push('/'); // Redirect to the home page if logged in
        } else {
          console.log('No valid session found:', data.error);
        }
      } catch (error) {
        console.error('Error validating session:', error);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/login?email=${email}&pass=${password}`, {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent
      });
      const result = await response.json();

      if (result.success) {
        console.log('Login successful. Session token set.');
        setMessage(`Welcome back, ${result.session?.email || 'User'}`);
        setSession(result.session); // Save session data after login
        router.push('/'); // Redirect to home page after successful login
      } else {
        setMessage(result.message || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <SignInContainer>
      <CssBaseline />
      <Card>
        <Typography component="h1" variant="h4" textAlign="center">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <FormControl fullWidth>
            <FormLabel>Email</FormLabel>
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>Password</FormLabel>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" variant="contained" fullWidth>
            Sign In
          </Button>
        </Box>
        {message && <Typography color="error">{message}</Typography>}
      </Card>
    </SignInContainer>
  );
}
