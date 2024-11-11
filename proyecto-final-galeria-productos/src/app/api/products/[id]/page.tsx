
import {Button, Card, CardContent, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

interface Params {
    params: {
        id: number
    }
}

async function getProduct(id: number): Promise<Producto> {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    if (!res.ok) {
        throw new Error(`Se produjo un error cargando el producto ${id}`);
    }
    return res.json()
}

export default async function UserProfile({ params }: Params) {
    const producto = await getProduct(params.id)

    return (
        <>
            <h1>{producto.name}</h1>
            <Grid size = {{ xs: 12, sm: 6, md: 4}}  key={producto.id}>
                <Card>
                    <Image
                        src={`https://picsum.photos/id/${producto.id}/500/300`}
                        alt={producto.name}
                        width={500}
                        height={300}
                        layout="responsive"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {producto.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {producto.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>{producto.price}</b>
                        </Typography>
                        <Button startIcon={<AddShoppingCartOutlinedIcon />} sx={{
                            backgroundColor: '#6f528a',
                            borderRadius: 10,
                            padding: 2,
                            margin:2,
                            alignItems: 'left',
                        }} >Agregar al carrito</Button>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}