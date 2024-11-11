import { Box, Typography, Link } from '@mui/material';
import {FollowUsButtons} from "@/app/Components/FollowUs";


export function Footer() {
    return (
        <Box component="footer" sx={{ backgroundColor: '#DFD8F7', py: 6 }}>
            <Typography variant="subtitle1" color="text.primary" align="center" gutterBottom>Síguenos en redes sociales</Typography>
            <FollowUsButtons/>
            <Typography variant="subtitle1" color="text.primary" align="center">
                <Link color="inherit" href="https://politicadeprivacidadplantilla.com/">
                    Política de privacidad
                </Link>
            </Typography>
        </Box>
    );
}