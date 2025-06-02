import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import AuthWrapper from 'sections/auth/AuthWrapper';

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleInitiateRegistration = async () => {
    if (!email || !name || !password) {
      setError('All fields are required for registration.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/initiate-registration', { email, name, password });
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!otp) {
      setError('OTP is required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/complete-registration', { email, otp });
      setError('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">{step === 1 ? 'Sign up' : 'Verify OTP'}</Typography>
            <Typography
              component={Link}
              to="/login"
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Already have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2}>
            {error && <Typography color="error">{error}</Typography>}
            {step === 1 ? (
              <>
                <TextField
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleInitiateRegistration}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Sending OTP...' : 'Register'}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="OTP"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCompleteRegistration}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
