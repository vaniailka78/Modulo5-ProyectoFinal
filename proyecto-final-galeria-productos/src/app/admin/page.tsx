'use client'

import React, {useState} from 'react';
import {Container, Typography, Box, Button} from '@mui/material';
import {DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel} from '@mui/x-data-grid';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { fetchProductos, addProductos, updateProductos, deleteProductos, ProductsResponse, Productos } from './services/productosService';
import AddEditProductosDialog from './components/AddEditProductosDialog';
import DeleteProductosDialog from "@/app/admin/components/DeleteProductosDialog";

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Dashboard: React.FC = () => {
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingProducts, setEditingProducts] = useState<Productos | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

    const queryClient = useQueryClient();//

    const {data, isLoading} = useQuery<ProductsResponse>({
        queryKey: ['productsList', paginationModel.page, paginationModel.pageSize],
        queryFn: () => fetchProductos(paginationModel.page + 1, paginationModel.pageSize),
    });

    const addMutation = useMutation({
        mutationFn: addProductos,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['productsList']}),
    });

    const updateMutation = useMutation({
        mutationFn: updateProductos,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['productsList']}),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProductos,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['productsList']}),
    });

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nombre', width: 200 },
        { field: 'description', headerName: 'Descripción', width: 400 },
        { field: 'price', headerName: 'Precio', width: 70 },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Button color={"secondary"} startIcon={<EditOutlinedIcon />} id="buttonEditar"
                    onClick={() => {
                        setIsAddDialogOpen(true);
                        setEditingProducts(params.row as Productos);
                    }}><b>Editar</b></Button>
                    <Button color={"secondary"}  startIcon={<DeleteOutlineOutlinedIcon />} id="buttonEliminar"
                            onClick={() => setDeletingProductId(params.row.id as number)}><b>Eliminar</b></Button>
                </>
            ),
        },
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{my: 4}}>
                <Typography variant="h4" component="h1" color={"secondary"} gutterBottom>
                    <b>Dashboard de Productos</b>
                </Typography>
                <Button variant="contained" color="secondary" startIcon={<AddCircleOutlineIcon />} 
                name="buttonaddprod"
                id="buttonaddprod"
                sx={{
                    backgroundColor: '#6f528a',
                    borderRadius: 10,
                    padding: 2,
                    margin:2,
                    alignItems: 'left',
                }} onClick={() => setIsAddDialogOpen(true)}>
                    Agregar Producto
                </Button>
                <DataGrid
                    rows={data?.productsList ?? []}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    pagination
                    paginationMode="server"
                    rowCount={data?.totalCount ?? 100}
                    loading={isLoading}
                    autoHeight
                />
                {isAddDialogOpen && <AddEditProductosDialog
                    open={isAddDialogOpen}
                    onClose={() => {
                        setIsAddDialogOpen(false);
                        setEditingProducts(null);
                    }}
                    products={editingProducts}
                    onSubmit={(data) => {
                        if (editingProducts) {
                            updateMutation.mutate(data as Productos);
                        } else {
                            addMutation.mutate(data as Productos);
                        }
                    }}
                />}
                <DeleteProductosDialog
                    open={!!deletingProductId}
                    onClose={() => setDeletingProductId(null)}
                    onConfirm={() => deletingProductId && deleteMutation.mutate(deletingProductId)}
                />
            </Box>
        </Container>
    );

};

export default Dashboard;

