'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, purple } from '@mui/material/colors';
import ResponsiveAppBar from '../navbar/page';

// Create a theme
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
    fetch('http://localhost:3000/api/cart')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setData(items);

        // Calculate the total price
        let total = 0;
        for (let item of items) {
          total += parseFloat(item.price) || 0; // Convert to number and default to 0
        }
        setTotalPrice(total);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]);
        setTotalPrice(0);
        setLoading(false);
      });
  }, []);

  // Function to handle item deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (response.ok) {
        // Remove the item from the data state
        setData(data.filter(item => item._id !== id));

        // Recalculate the total price
        const newTotal = data
          .filter(item => item._id !== id)
          .reduce((sum, item) => sum + (item.price || 0), 0);
        setTotalPrice(newTotal);
       
        alert(result.message); // Show success message
      } else {
        alert(result.error); // Show error message
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
                {item.type} - {item.pname} - ${item.price}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(item._id)} // Call handleDelete with the item's ID
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <div>No items in the cart</div>
          )}
          <div style={{ fontSize: '24px', marginTop: '20px' }}>
            Total Price: ${ parseFloat(totalPrice).toFixed(2)}
          </div>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Check Out
          </Button>
        </div>
      </Container>
    </ThemeProvider>
  );
}
