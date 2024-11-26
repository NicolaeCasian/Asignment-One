'use client';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';

import ResponsiveAppBar from '../navbar/page';

export default function ManagerDashboard() {
    // Ensures orders is an array
  const [orders, setOrders] = useState([]); 
  //State for loading phase
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        //fetches the dahsboard API
        const response = await fetch('/api/dash');
        const data = await response.json();

        // Log the response for debugging
        console.log('Fetched orders:', data);

        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('API response is not an array:', data);
          setError('Unexpected data format received from the server.');
        }

        setLoading(false);
      } catch (fetchError) {
        console.error('Error fetching orders:', fetchError);
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Manager Dashboard
        </Typography>

       
        {error && (  // Display error message if fetching orders fails 
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
            //if in a loading state show Loading
          <Typography align="center">Loading...</Typography>
        ) : (
          <TableContainer component={Paper} aria-label="Orders Table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Email</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total Price (€)</TableCell>
                  <TableCell>Order Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(orders) && orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{order.email || 'N/A'}</TableCell>
                      <TableCell>
                        {order.items
                          ?.map(
                            (item) =>
                              `${item.quantity} x ${item.pname} (${item.type})`
                          )
                          .join(', ') || 'No items'}
                      </TableCell>
                      <TableCell>
                        {typeof +order.totalPrice === 'number' && !isNaN(+order.totalPrice)
                          ? (+order.totalPrice).toFixed(2)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleString()
                          : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
}
