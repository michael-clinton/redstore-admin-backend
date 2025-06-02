import { useEffect, useState } from 'react';
import axiosInstance from '../../../../../api/axios';
import {
  Typography,
  Box,
  Avatar,
  Paper,
  Stack,
  CircularProgress,
  Divider,
} from '@mui/material';

export default function ViewProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axiosInstance
      .get(`/api/user/profile/${userId}`)
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        setProfile(null);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (!profile)
    return (
      <Typography align="center" variant="h6" color="error" mt={4}>
        Profile not found.
      </Typography>
    );

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: { xs: '95%', sm: 1000, md: 1100 },
        width: '100%',
        mx: 'auto',
        mt: 6,
        p: 6,
        borderRadius: 4,
        bgcolor: 'background.paper',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <Stack spacing={4} alignItems="center">
        <Avatar
          src={profile.profileImage || ''}
          alt={profile.name}
          sx={{ width: 160, height: 160, mb: 1, boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
        />
        <Typography variant="h4" fontWeight="bold" color="primary">
          {profile.name}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontStyle: 'italic', maxWidth: 800, textAlign: 'center' }}
        >
          {profile.bio || 'No bio available'}
        </Typography>
        <Divider sx={{ width: '100%', my: 3 }} />

        <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Email
          </Typography>
          <Typography variant="body1" mb={3}>
            {profile.email}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Role
          </Typography>
          <Typography variant="body1" mb={3}>
            {profile.role || 'N/A'}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Phone
          </Typography>
          <Typography variant="body1">{profile.phone || 'Not provided'}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
