import {Typography, Button, Container, CardMedia} from '@mui/material';
import Grid from "@mui/material/Grid2";
import * as React from "react";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

export function Hero() {
    return (
        <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="center"
            padding={10}
        >
            <Container maxWidth="md">
                <CardMedia
                    component="img"
                    height="420"
                    width="500"
                    image='https://github.com/vaniailka78/Modulo4-Proyecto-Final/blob/master/Recursos/Fondo.png?raw=true'
                    alt='HeroImage'
                />
            </Container>
            <Container maxWidth="sm">
                <Grid
                    container
                    spacing={1}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography component="h1" variant="h2" align="center" color={"secondary"} gutterBottom>
                        Suscríbete a nuestro boletín
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph>
                        Y descubea todas nuestras ofertas y novedades
                    </Typography>
                    <Button color="secondary" variant="contained" startIcon={<EmailOutlinedIcon />} sx={{
                        backgroundColor: '#6f528a',
                        borderRadius: 10,
                        padding: 2,
                        margin:2,
                        alignItems: 'center',
                    }}>¡Suscríbete!
                    </Button>
                </Grid>
            </Container>
        </Grid>
    );
}