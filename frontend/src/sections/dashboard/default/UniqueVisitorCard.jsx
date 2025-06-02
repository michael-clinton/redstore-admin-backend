import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axios'; // Custom axios instance

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

export default function UniqueVisitorCard() {
  const [view, setView] = useState('monthly'); // 'monthly' or 'weekly'
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get('/api/views/unique-visitors', {
          params: { view },
        });
        setVisitorData(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [view]);

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5" component="h2">
            Unique Visitors
          </Typography>
        </Grid>
        <Grid>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              onClick={() => setView('monthly')}
              color={view === 'monthly' ? 'primary' : 'secondary'}
              variant={view === 'monthly' ? 'outlined' : 'text'}
            >
              Month
            </Button>
            <Button
              size="small"
              onClick={() => setView('weekly')}
              color={view === 'weekly' ? 'primary' : 'secondary'}
              variant={view === 'weekly' ? 'outlined' : 'text'}
            >
              Week
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">Error: {error}</Typography>
          ) : visitorData.length > 0 ? (
            <IncomeAreaChart view={view} data={visitorData} />
          ) : (
            <Typography>No visitor data available.</Typography>
          )}
        </Box>
      </MainCard>
    </>
  );
}
