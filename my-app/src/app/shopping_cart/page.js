'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  CssBaseline,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Avatar,
  Stack,
} from '@mui/material';
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

  // Helper function to calculate the total price
  const calculateTotalPrice = (items) => {
    return items.reduce((sum, item) => {
      // Makes Sure price is a number
      const itemPrice = parseFloat(item.price) || 0; 
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const res = await fetch('/api/cart/retrieve');
      const items = await res.json();

      const groupedItems = items.reduce((acc, item) => {
        const key = `${item.type}-${item.pname}`;
        if (acc[key]) {
          acc[key].quantity += 1;
        } else {
          acc[key] = { ...item, quantity: 1 };
        }
        return acc;
      }, {});

      const itemsArray = Object.values(groupedItems);
      setData(itemsArray);
      setTotalPrice(calculateTotalPrice(itemsArray));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setData([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Handle item deletion
  const handleDelete = async (id) => {
    try {
      //If no id show alert
      if (!id) {
        console.error('Invalid ID provided for deletion.');
        alert('Error: Invalid item ID.');
        return;
      }

      console.log('Attempting to delete item with id:', id);
      //Fetch the cart api for DELETE method for deleting items from cart
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      //If its succsefull look through the databse for items again and
      //update the data then set the current data to the updateData and use
      //the new data to calculate the new Price 
      if (response.ok) {
        const updatedData = data
          .map((item) =>
            item._id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0);

        setData(updatedData);

        const newTotal = calculateTotalPrice(updatedData);
        setTotalPrice(newTotal);

        alert('Item removed successfully.');
      } else {
        const errorResult = await response.json();
        console.error('Error response from server:', errorResult);
        alert(errorResult.message || 'Failed to remove item.');
      }
    } catch (error) {
      console.error('Error during item deletion:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    try {
      //convert the items into a query string and send it to the order api
      const itemsQueryString = data
        .map((item) => `items[]=${encodeURIComponent(JSON.stringify(item))}`)
        .join('&');
        
      const url = `/api/order?${itemsQueryString}&totalPrice=${totalPrice}`;

      const response = await fetch(url, { method: 'GET' });

      if (response.ok) {
        // Clear the cart from the backend after successful checkout
        const clearCartResponse = await fetch('/api/cart/clear', {
          method: 'DELETE',
        });

        if (clearCartResponse.ok) {
          // Clear the cart in the frontend and Reset the total price
          setData([]); 
          setTotalPrice(0); 
          alert('Order placed and cart cleared successfully!');
        } else {
          console.error('Error clearing cart from backend.');
        }
      } else {
        const errorResult = await response.json();
        alert(errorResult.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveAppBar />
      <Container component="main">
        <CssBaseline />
        <Typography variant="h4" align="center" gutterBottom>
          Shopping Cart
        </Typography>
        {loading ? (
          <Typography align="center">Loading...</Typography>
        ) : data.length > 0 ? (
          <Grid container spacing={3}>
            {data.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={`${item.type}-${item.pname}`}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar alt={item.pname} src={`/images/${item.type}.jpg`} />
                      <Typography variant="h6">{item.pname}</Typography>
                    </Stack>
                    <Typography variant="body2" color="textSecondary">
                      Type: {item.type}
                    </Typography>
                    <Typography variant="body1">Price: €{item.price}</Typography>
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(item._id)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center">No items in the cart</Typography>
        )}
        <Typography
          variant="h5"
          align="right"
          style={{ marginTop: '20px', fontWeight: 'bold' }}
        >
          Total Price: €{totalPrice.toFixed(2)}
        </Typography>
        {data.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
            onClick={handleCheckout}
          >
            Check Out
          </Button>
        )}
      </Container>
    </ThemeProvider>
  );
}
