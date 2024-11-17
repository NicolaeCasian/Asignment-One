'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, purple } from '@mui/material/colors';
import ResponsiveAppBar from '../navbar/page';


const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
    secondary: {
      main: purple[500],
    },
  },
});

export default function ShoppingCart() {
  const [data, setData] = useState([]); // State for storing cart items
  const [loading, setLoading] = useState(true); // State for loading status
  const [totalPrice, setTotalPrice] = useState(0); // State for total price

  useEffect(() => {
    // Fetch the cart data from the API
    fetch('http://localhost:3000/api/cart')
      .then((res) => res.json())
      .then((data) => {
        // Make sure data is an array
        const items = Array.isArray(data) ? data : [];
        setData(items);

        // Calculate the total price
        let total = 0;
        for (let item of items) {
          total += parseFloat(item.price) || 0; // Convert from String to Int and add 
        }
        setTotalPrice(total); // Set the total price

        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]); // Set an empty array if there's an error
        setTotalPrice(0); // Reset total price if there's an error
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveAppBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={{ fontSize: '40px' }}>Shopping Cart</div>
        <div>
          {loading ? (
            <div>Loading...</div> 
          ) : data.length > 0 ? (
            data.map((item) => (
              <div style={{ padding: '20px' }} key={item._id}>
                {item.type} - {item.pname} -  €{item.price}
              </div>
            ))
          ) : (
            <div>No items in the cart</div> // Cart is Empty
          )}
          <div style={{ fontSize: '24px', marginTop: '20px' }}>
            Total Price:  €{totalPrice.toFixed(2)}
          </div>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Check Out
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
}
