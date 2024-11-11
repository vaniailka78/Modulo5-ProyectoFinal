import {AppBar, Toolbar, Typography, Button, CardMedia} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import * as React from "react";
import Grid from "@mui/material/Grid2";
import Link from 'next/link';
import LoginIcon from '@mui/icons-material/Login';

export function Header() {
    return (
        <AppBar position="static" elevation={1}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
                <Grid>
                    <CardMedia
                        component="img"
                        height="80"
                        width="80"
                        image='https://github.com/vaniailka78/Modulo4-Proyecto-Final/blob/master/Recursos/Logo.jpeg?raw=true'
                        alt='logo'
                    />
                </Grid>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" color={"secondary"} fontSize={30}>
                    <b>Vania&apos; On-line Shop</b>
                    </Typography>
                    <Typography variant="body1">
                        ¡La tienda on-line que lo tiene todo!
                    </Typography>
                </Typography>
                <Button color="secondary"><b>Nosotros</b></Button>
                <Button color="secondary"><b>Productos</b></Button>
                <Button color="secondary"><b>Ofertas</b></Button>
                <Button color="secondary"><b>Contacto</b></Button>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
                <Button>
                    <ShoppingCartIcon fontSize="large" color="secondary"/>
                </Button>
                <Link href="/login" passHref legacyBehavior>
                    <Button color="secondary" variant="contained" startIcon={<LoginIcon />} sx={{
                        backgroundColor: '#6f528a',
                        borderRadius: 10,
                        padding: 2,
                        margin:2,
                        alignItems: 'left',
                    }} 
                    data-testid="button-login"
                    >Iniciar sesión
                    </Button>
                </Link>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}