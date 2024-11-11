'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
    email: z.string().min(1, 'Se requiere el correo electrónico'),
    password: z.string().min(6, 'El Password debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof schema>;

export default function LoginPage() {
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const token = await login(data.email, data.password);

            console.log(data.email);
            console.log(data.password);
            console.log(token);
            // Redirect or show success message
        } catch (error) {
            console.error('Login failed:', error);
            // Show error message
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Inicia sesión
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            {...register('email')}
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                        <TextField
                            {...register('password')}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            name="buttonlogin"
                            id="buttonlogin"
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Iniciar sesión
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
