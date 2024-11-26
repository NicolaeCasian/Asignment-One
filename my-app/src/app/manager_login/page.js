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
    //Manager does not have session he just views the Dashboard IK not safe but whatever 
    const checkSession = async () => {
      try {
        const res = await fetch('/api/sessions', { credentials: 'include' });
        const data = await res.json();

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
//Fetches the manager api login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/manager?email=${email}&pass=${password}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();

      if (result.success) {
        setMessage(`Welcome back, ${result.session?.email || 'Manager'}`);
        setSession(result.session);
        router.push('/dashboard');
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
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
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
        {message && (
          <Typography color="error" textAlign="center" marginTop={2}>
            {message}
          </Typography>
        )}
        <Typography textAlign="center" marginTop={2}>
          Not a Customer{' '}
          <Link href="/login" color="primary">
            Go to back to Customer Login
          </Link>
        </Typography>
      </Card>
    </SignInContainer>
  );
}
