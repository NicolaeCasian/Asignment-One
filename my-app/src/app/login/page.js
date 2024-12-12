'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Link,
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
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    //Checks User Session
    const checkSession = async () => {
      try {
        //Fetches the session API and makes sure to include credentials
        const res = await fetch('/api/sessions', { credentials: 'include' });
        const data = await res.json();
        //If user has a session redirect to the homepage
        if (res.ok && data.loggedIn) {
          setSession(data.session);
          router.push('/');
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
      //fetches the login API and the email and password
      const response = await fetch(`/api/login?email=${email}&pass=${password}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      //If the credentials are correct it will display a message and redirect the user
      //to the homepage
      if (result.success) {
        setMessage(`Welcome back, ${result.session?.email || 'User'}`);
        setSession(result.session);
        router.push('/');
      } else {
        //displays invalid credentials if the input does not align with the database
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
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputProps={{ maxLength: 20 }} 
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ maxLength: 20 }} 
              required
            />
          </FormControl>
          <Button type="submit" variant="contained" fullWidth>
            Sign In
          </Button>
        </Box>
        {message && (
          <Typography color="error" textAlign="center" marginTop={2}>
            {message}
          </Typography>
        )}
        <Typography textAlign="center" marginTop={2}>
          Not registered?{' '}
          <Link href="/register" color="primary">
            Go to Register
          </Link>
        </Typography>
        <Typography textAlign="center" marginTop={2}>
          Staff Member?{' '}
          <Link href="/manager_login" color="primary">
            Go to Staff Login
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
}
