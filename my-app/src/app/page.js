'use client';
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container, Button } from '@mui/material';
import ResponsiveAppBar from './navbar/page';
import { useRouter } from 'next/navigation';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const sessionRes = await fetch('/api/sessions', { credentials: 'include' });
        const sessionData = await sessionRes.json();

        if (!sessionRes.ok || !sessionData.loggedIn) {
          console.log('No valid session. Redirecting to login.');
          router.push('/login');
          return;
        }

        console.log('Session is valid:', sessionData);

        const productsRes = await fetch('/api/getProducts', { credentials: 'include' });
        if (productsRes.ok) {
          const products = await productsRes.json();
          setData(products);
        } else {
          console.error('Failed to fetch products.');
        }
      } catch (error) {
        console.error('Error during session or data validation:', error);
        router.push('/login');
      }
    };

    validateSession();
  }, [router]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddToCart = async (item) => {
    try {
      //convert the item details into query strings
      const query = new URLSearchParams({
        id: item._id,
        pname: item.pname,
        price: item.price,
        type: item.type,
      }).toString();
      //Make a get request to the API to add to cart
      const response = await fetch(`/api/cart?${query}`, {
        method: 'GET', 
        credentials: 'include',
      });
      
      const result = await response.json();
      //if succesfull show alert message
      if (response.ok) {
        alert('Item added to cart successfully!');
      } else {
        //if not show alert message to display that
        alert(result.error || 'Failed to add item to cart.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('An error occurred. Please try again.');
    }
  };
//Filters doughnuts by type
  const filterDoughnutsByType = (type) => {
    return data.filter((item) => item.type === type);
  };

  return (
    <Box sx={{ width: '100%', justifyContent: 'center' }}>
      <ResponsiveAppBar />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Jam Doughnuts" {...a11yProps(0)} />
          <Tab label="Glazed Doughnuts" {...a11yProps(1)} />
          <Tab label="Chocolate Doughnuts" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Container>
          <Typography variant="h4">Jam Doughnuts</Typography>
          {filterDoughnutsByType('jam').map((item, i) => (
            <Card 
            key={i} 
            sx={{ 
              width: 300,  
              height: 400, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              mb: 2 
            }}
          >
            <CardMedia
              component="img"
              alt="Jam Doughnut"
              image="/images/Jam1.png"
              sx={{
                height: '150px', 
                objectFit: 'cover', 
              }}
            />
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{item.pname}</Typography>
              <Typography>This is a delicious Jam Doughnut!</Typography>
              <Typography variant="body1">€{item.price}</Typography>
            </CardContent>
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleAddToCart(item)}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
          
          ))}
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Container>
          <Typography variant="h4">Glazed Doughnuts</Typography>
          {filterDoughnutsByType('glazed').map((item, i) => (
          <Card 
            key={i} 
            sx={{ 
            width: 300,  
            height: 400, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
              mb: 2 
            }}
          >
          <CardMedia
            component="img"
            alt="Glazed Doughnut"
            image="/images/glazed.png"
           sx={{
           height: '150px', 
           objectFit: 'cover', 
            }}
           />
          <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h6">{item.pname}</Typography>
          <Typography>This is a delicious Glazed Doughnuts!</Typography>
          <Typography variant="body1">€{item.price}</Typography>
          </CardContent>
          <CardContent>
          <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => handleAddToCart(item)}
          >
          Add to Cart
        </Button>
  </CardContent>
</Card>
          ))}
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <Container>
          <Typography variant="h4">Chocolate Doughnuts</Typography>
          {filterDoughnutsByType('chocolate').map((item, i) => (
             <Card 
             key={i} 
             sx={{ 
               width: 300,  
               height: 400,
               display: 'flex', 
               flexDirection: 'column', 
               justifyContent: 'space-between', 
               mb: 2 
             }}
           >
             <CardMedia
               component="img"
               alt="Jam Doughnut"
               image="/images/chocolate.png"
               sx={{
                 height: '150px', 
                 objectFit: 'cover', 
               }}
             />
             <CardContent sx={{ textAlign: 'center' }}>
               <Typography variant="h6">{item.pname}</Typography>
               <Typography>A delicious Chocolate doughnut!</Typography>
               <Typography variant="body1">€{item.price}</Typography>
             </CardContent>
             <CardContent>
               <Button
                 variant="contained"
                 color="primary"
                 fullWidth
                 onClick={() => handleAddToCart(item)}
               >
                 Add to Cart
               </Button>
             </CardContent>
           </Card>
          ))}
        </Container>
      </CustomTabPanel>
    </Box>
  );
}
