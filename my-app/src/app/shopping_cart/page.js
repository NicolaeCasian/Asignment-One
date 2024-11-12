'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: purple[500],
    },
  },
});

export default function ShoppingCart() {
  const [data, setData] = useState([]); // State for storing cart items
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    fetch('http://localhost:3000/api/cart')
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data); // Log the data to inspect the structure

        // Ensure data is an array
        setData(Array.isArray(data) ? data : []);
        setLoading(false); // Set loading to false after data is processed
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]); // Set an empty array if there's an error
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={{ fontSize: '40px' }}>Shopping Cart</div>
        <div>
          {loading ? (
            <div>Loading...</div> // Show loading message
          ) : data.length > 0 ? (
            data.map((item) => (
              <div style={{ padding: '20px' }} key={item._id}>
                <br />
                {item.type} - {item.pname} - {item.price}
                <br />
              </div>
            ))
          ) : (
            <div>No items in the cart</div> // Show message if cart is empty
          )}
          <Button variant="contained" color="primary">Check Out</Button>
        </div>
      </Container>
    </ThemeProvider>
  );
}
