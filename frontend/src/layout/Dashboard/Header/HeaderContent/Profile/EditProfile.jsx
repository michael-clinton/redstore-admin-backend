import { useState, useEffect } from 'react';
import axiosInstance from '../../../../../api/axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    Avatar,
    Paper,
    Stack,
    Alert,
    CircularProgress,
} from '@mui/material';

export default function EditProfile() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        profileImage: null,
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        axiosInstance
            .get(`/api/user/profile/${userId}`)
            .then((res) => {
                setProfile({
                    ...res.data,
                    profileImage: null, // reset file input
                });
                setPreviewImage(res.data.profileImage || '');
                setLoading(false);
            })
            .catch(() => {
                setMessage('Failed to load profile');
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile((prev) => ({ ...prev, profileImage: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleImageUpload = async (file) => {
        try {
            const formData = new FormData();
            // IMPORTANT: use 'profileImage' here to match your backend multer field
            formData.append('profileImage', file);

            const { data } = await axiosInstance.post('/api/user/profile/upload-profile-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return data.imageUrl;
        } catch {
            throw new Error('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setMessage('User not authenticated');
            return;
        }

        try {
            setMessage('');
            const formData = new FormData();

            formData.append('name', profile.name);
            formData.append('email', profile.email);
            formData.append('bio', profile.bio);
            formData.append('phone', profile.phone);

            // Append image file only if selected (new file)
            if (profile.profileImage) {
                formData.append('profileImage', profile.profileImage);
            }

            await axiosInstance.put(`/api/user/profile/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Failed to update profile');
        }
    };

    if (loading)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    return (
        <Paper
            elevation={6}
            sx={{
                width: '100%',
                maxWidth: { xs: 480, sm: 600, md: 720, lg: 900 },
                mx: 'auto',
                mt: 6,
                p: 5,
                borderRadius: 3,
                backgroundColor: '#fafafa',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
                Edit Profile
            </Typography>

            {message && (
                <Alert
                    severity={message.includes('Failed') ? 'error' : 'success'}
                    sx={{ mb: 3, fontWeight: 'medium' }}
                >
                    {message}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>

                    <Box textAlign="center" mt={1}>
                        <Avatar
                            src={previewImage}
                            alt="Profile Preview"
                            sx={{
                                width: 120,
                                height: 120,
                                mx: 'auto',
                                mb: 2,
                                border: '2px solid',
                                borderColor: 'primary.main',
                            }}
                        />
                        <Button variant="contained" component="label" sx={{ mb: 1 }}>
                            Choose Image
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <TextField
                        label="Name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="medium"
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        size="medium"
                    />

                    <TextField
                        label="Bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        size="medium"
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="medium"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        sx={{ mt: 2, fontWeight: 'bold' }}
                    >
                        Save Changes
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}
