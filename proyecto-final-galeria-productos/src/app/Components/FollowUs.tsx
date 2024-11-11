import * as React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

const commonButtonStyles = {
    backgroundColor: '#DFD8F7',
    variant: 'outlined',
    elevation: 0,
};

export function FollowUsButtons() {
  return (
      <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="center"
          minHeight={80}
      >
          <Button sx={{ ...commonButtonStyles}} href={"https://web.whatsapp.com/"}>
              <WhatsAppIcon fontSize="large" color="secondary"/>
          </Button>
          <Button sx={{ ...commonButtonStyles}} href={"https://instagram.com"}>
              <InstagramIcon fontSize="large" color="secondary"/>
          </Button>
          <Button sx={{ ...commonButtonStyles}} href={"https://es-la.facebook.com/"}>
              <FacebookRoundedIcon fontSize="large" color="secondary"/>
          </Button>
          <Button sx={{ ...commonButtonStyles}} href={"https://www.youtube.com/"}>
              <YouTubeIcon fontSize="large" color="secondary"/>
          </Button>
      </Grid>
  );
}