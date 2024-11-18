'use client';
import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container, Button } from '@mui/material';
import ResponsiveAppBar from './navbar/page'; 

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

  useEffect(() => {
    fetch('http://localhost:3000/api/getProducts')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Filters doughnuts by type
  const filterDoughnutsByType = (type) => {
    return data.filter((item) => item.type === type);
  };

  const handleAddtoCart = async (product) => {
    if (!product) return;

    const { type, pname, price } = product;

    try {
      const response = await fetch(
        `http://localhost:3000/api/cart?type=${encodeURIComponent(type)}&pname=${encodeURIComponent(pname)}&price=${encodeURIComponent(price)}`
      );
      const result = await response.json();
      if (response.ok) {
        console.log(result.data);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
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
        <Container component="main" maxWidth="xs">
          <div style={{ fontSize: '40px' }}>Jam Doughnuts</div>
          <div>
            {filterDoughnutsByType('jam').map((item, i) => (
              <Card sx={{ maxWidth: 345, marginBottom: 2 }} key={i}>
                <CardMedia
                  component="img"
                  alt="Jam Doughnut"
                  height="140"
                  image="/images/Jam1.png"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.pname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A nice Jam Doughnut trust me!
                    <br></br>
                    {item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={() => handleAddtoCart(item)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <Container component="main" maxWidth="xs">
          <div style={{ fontSize: '40px' }}>Glazed Doughnuts</div>
          <div>
            {filterDoughnutsByType('glazed').map((item, i) => (
              <Card sx={{ maxWidth: 345, marginBottom: 2 }} key={i}>
                <CardMedia
                  component="img"
                  alt="Glazed Doughnut"
                  height="140"
                  image="/images/glazed.png" 
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.pname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  A nice Glazed Doughnut trust me!
                  <br></br>
                    {item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={() => handleAddtoCart(item)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </Container>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <Container component="main" maxWidth="xs">
          <div style={{ fontSize: '40px' }}>Chocolate Doughnuts</div>
          <div>
            {filterDoughnutsByType('chocolate').map((item, i) => (
              <Card sx={{ maxWidth: 345, marginBottom: 2 }} key={i}>
                <CardMedia
                  component="img"
                  alt="Chocolate Doughnut"
                  height="140"
                  image="/images/chocolate.png" 
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {item.pname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  A nice Chocolate Doughnut trust me!
                  <br></br>
                    {item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" onClick={() => handleAddtoCart(item)}>
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </Container>
      </CustomTabPanel>
    </Box>
  );
}
