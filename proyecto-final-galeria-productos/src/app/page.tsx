'use client'

import React from 'react';
import { Container, Typography, Card, CardContent, Button} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

import Grid from "@mui/material/Grid2";
import {Header} from "@/app/Components/Header";
import {Footer} from "@/app/Components/Footer";
import {Hero} from "@/app/Components/Hero";

interface Producto {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  imageUrl: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getProducts(): Promise<{
  productsList: Producto[];
  totalCount: number;
}> {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) {
    throw new Error('Se produjo un error cuando se extraian los productos');
  }
  return res.json();
}

export default async function ProductsPage() {
  const {productsList} = await getProducts();

  return (
      <>
        <Header/>
        <Hero/>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Container maxWidth="lg" sx={{ mt: 0, mb: 10 }}>
            <Typography variant="h2" component="h1" color={"secondary"} gutterBottom>
              ¡Conozca nuestros productos!
            </Typography>
          </Container>
          <Grid container spacing={4}>
            {productsList.map((item) => (
                <Grid size = {{ xs: 12, sm: 6, md: 4}}  key={item.id}>
                  <Card>
                    <Image
                        src={`https://picsum.photos/id/${item.id}/500/300`}
                        alt={item.name}
                        width={500}
                        height={300}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description.substring(0, 100)}...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>{item.price}</b>
                      </Typography>
                      <Link href={`/api/products/${item.id}`} passHref legacyBehavior>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                          Leer más
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Container>
        <Footer/>
      </>
  );
}