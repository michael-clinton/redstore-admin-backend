import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import axiosInstance from '../../../../../api/axios';
import { useNavigate } from 'react-router-dom';

// Material-UI imports
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Project imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';

// Assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

// TabPanel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function Profile() {
  const theme = useTheme();
  const navigate = useNavigate(); // <-- Added this line

  // Fallback avatar if profile image fails to load or is null
  const fallbackAvatar = '/images/default-avatar.png'; // <-- change this to your fallback image URL

  // State and Refs
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    role: '',
    avatar: null,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    axiosInstance.get(`/api/user/profile/${userId}`)
      .then((response) => {
        const data = response.data;

        // Check if avatar is a relative path and prepend baseURL if needed
        if (data.avatar && !data.avatar.startsWith('http')) {
          const baseURL = axiosInstance.defaults.baseURL || '';
          data.avatar = baseURL + data.avatar;
        }

        setProfileData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/login');  // <-- navigate used here
  };

  // Handlers
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return <Typography sx={{ px: 2 }}>Loading profile...</Typography>;
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      {/* Profile Button */}
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? 'grey.100' : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 },
        }}
        ref={anchorRef}
        aria-label="open profile"
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', p: 0.5 }}>
          <Avatar
            alt="profile user"
            src={profileData.avatar || fallbackAvatar}
            size="sm"
            onError={(e) => {
              e.currentTarget.src = fallbackAvatar;
            }}
          />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {profileData.name || 'Unknown User'}
          </Typography>
        </Stack>
      </ButtonBase>

      {/* Profile Popper */}
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={{
          offset: {
            options: { offset: [0, 9] },
          },
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ width: 290, boxShadow: theme.customShadows.z1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  {/* Profile Content */}
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            alt="profile user"
                            src={profileData.avatar || fallbackAvatar}
                            sx={{ width: 32, height: 32 }}
                            onError={(e) => {
                              e.currentTarget.src = fallbackAvatar;
                            }}
                          />
                          <Stack>
                            <Typography variant="h6">{profileData.name || 'Unknown User'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {profileData.role || 'No Role Provided'}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid>
                        <Tooltip title="Logout">
                          <IconButton size="large" color="inherit" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="profile tabs" variant="fullWidth">
                      <Tab icon={<UserOutlined />} label="Profile" {...a11yProps(0)} />
                      <Tab icon={<SettingOutlined />} label="Setting" {...a11yProps(1)} />
                    </Tabs>
                  </Box>

                  {/* Tab Panels */}
                  <TabPanel value={value} index={0}>
                    <ProfileTab handleLogout={handleLogout} /> {/* <-- Pass handleLogout here */}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <SettingTab />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
