'use client'

import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleMainPage = () => {
        router.push('/');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" color={"secondary"} sx={{ flexGrow: 1 }}>
                        <b>Panel de Administración</b>
                    </Typography>
                    {user && (
                        <>
                            <Typography variant="subtitle1" component="div"  sx={{ mr: 2 }}>
                                Bienvenido, {user.email}
                            </Typography>
                            <Button startIcon={<HomeOutlinedIcon />} sx={{
                                backgroundColor: '#6f528a',
                                borderRadius: 10,
                                padding: 2,
                                margin:2,
                                alignItems: 'left',
                            }} onClick={handleMainPage}>Vover al inicio</Button>
                            <Button startIcon={<LogoutIcon />} sx={{
                                backgroundColor: '#6f528a',
                                borderRadius: 10,
                                padding: 2,
                                margin:2,
                                alignItems: 'left',
                            }} onClick={handleLogout}>Cerrar Sesión</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {children}
            </Container>
        </>
    )
}