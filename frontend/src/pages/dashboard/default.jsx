// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

import axiosInstance from '../../api/axios'; // <-- Your axios instance path

// assets
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

import React, { useEffect, useState } from 'react';

export default function DashboardDefault() {
  const [analytics, setAnalytics] = useState([]);
  const [weeklyIncome, setWeeklyIncome] = useState(null);
  const [analyticsReport, setAnalyticsReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsResponse, incomeResponse, reportResponse] = await Promise.all([
          axiosInstance.get('/api/analytics'),
          axiosInstance.get('/api/orders/weekly'),
          axiosInstance.get('/api/orders/AnalyticsReport')
        ]);

        setAnalytics(analyticsResponse.data);
        setWeeklyIncome(incomeResponse.data.weeklyIncome);
        setAnalyticsReport(reportResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Row 1: Title */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      {/* Analytics Cards */}
      {loading ? (
        <Grid item xs={12}>
          <Typography>Loading analytics...</Typography>
        </Grid>
      ) : error ? (
        <Grid item xs={12}>
          <Typography color="error">Error: {error}</Typography>
        </Grid>
      ) : (
        analytics.map(({ title, count, percentage, color, bgColor }, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <AnalyticEcommerce
              title={title}
              count={typeof count === 'number' ? count.toLocaleString() : count}
              percentage={percentage ? parseFloat(percentage) : null}
              isLoss={color === 'red'}
              color={color === 'green' ? 'success' : 'warning'}
              extra=""
              sx={{ backgroundColor: bgColor, padding: 2, borderRadius: 2 }}
            />
          </Grid>
        ))
      )}

      {/* Spacer for responsiveness */}
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* Row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <UniqueVisitorCard />
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Income Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="h6" color="text.secondary">
                This Week Statistics
              </Typography>
              <Typography variant="h3">₹{weeklyIncome ?? '--'}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </MainCard>
      </Grid>

      {/* Row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <OrdersTable />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography
                variant="h5"
                color={analyticsReport && analyticsReport.financeGrowth > 0 ? 'success.main' : 'error.main'}
              >
                {analyticsReport ? `+${analyticsReport.financeGrowth}%` : '--'}
              </Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">{analyticsReport ? `${analyticsReport.expensesRatio}%` : '--'}</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">{analyticsReport ? analyticsReport.riskLevel : '--'}</Typography>
            </ListItemButton>
          </List>

          {/* Chart with orders data */}
          <ReportAreaChart orders={analyticsReport?.orders ?? []} />
        </MainCard>
      </Grid>
    </Grid>
  );
}
