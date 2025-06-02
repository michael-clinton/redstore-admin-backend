import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios'; // Import the axios instance

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import AuthWrapper from 'sections/auth/AuthWrapper';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token); // Store JWT token
      localStorage.setItem('userId', response.data.user.id); // Store user ID
      navigate('/'); // Redirect to a protected page
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <AuthWrapper
      sx={{
        // Remove any extra padding/margin from AuthWrapper if possible
        pt: 0,
        mt: 0,
      }}
    >
      <Grid
        container
        spacing={3}
        sx={{
          mt: 0, // remove margin-top on Grid container
          pt: 0, // remove padding-top
        }}
      >
        <Grid item xs={12}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'baseline',
              justifyContent: 'space-between',
              mb: { xs: -0.5, sm: 0.5 },
              mt: 0, // remove margin-top on Stack
            }}
          >
            <Typography variant="h3" sx={{ mt: 0 }}>
              Login
            </Typography>
            <Typography
              component={Link}
              to="/register"
              variant="body1"
              sx={{ textDecoration: 'none', mt: 0 }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            {error && <Typography color="error">{error}</Typography>}
            <TextField label="Username" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
