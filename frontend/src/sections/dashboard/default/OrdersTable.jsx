import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axios'; // Adjust the path as needed
import { NumericFormat } from 'react-number-format';
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import Dot from 'components/@extended/Dot';

// Order status component
function OrderStatus({ status }) {
  let color, title;
  switch (status) {
    case 'Paid':
      color = 'success';
      title = 'Paid';
      break;
    case 'Processing':
      color = 'info';
      title = 'Processing';
      break;
    case 'Shipped':
      color = 'primary';
      title = 'Shipped';
      break;
    case 'Delivered':
      color = 'success';
      title = 'Delivered';
      break;
    default:
      color = 'warning';
      title = 'Pending';
  }

  return (
    <Typography>
      <Dot color={color} /> {title}
    </Typography>
  );
}

export default function OrderTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('api/orders'); // Use axiosInstance here
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching all orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <Link href={`/orders/${order._id}`} color="secondary">
                    {order._id}
                  </Link>
                </TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <Typography key={item.productId?._id}>
                      {item.name || 'Product Name Missing'}
                    </Typography>
                  ))}
                </TableCell>
                <TableCell align="right">
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                </TableCell>
                <TableCell>
                  <OrderStatus status={order.status} />
                </TableCell>
                <TableCell align="right">
                  <NumericFormat
                    value={order.amount}
                    displayType="text"
                    thousandSeparator
                    prefix="₹"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
