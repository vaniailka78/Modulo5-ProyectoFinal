'use client'

import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import {useRouter} from "next/navigation";
import {Footer} from "@/app/Components/Footer";


export default function ProductLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const router = useRouter();

    const handleMainPage = () => {
        router.push('/');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" color={"secondary"} sx={{ flexGrow: 1 }}>
                        <b>Detalle del producto</b>
                    </Typography>
                    <Button startIcon={<HomeOutlinedIcon />} sx={{
                        backgroundColor: '#6f528a',
                        borderRadius: 10,
                        padding: 2,
                        margin:2,
                        alignItems: 'left',
                    }} onClick={handleMainPage}>Vover al inicio</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {children}
            </Container>
            <Footer/>
        </>
    )
}


