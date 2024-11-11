import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod';

const productosSchema = z.object({
    id:  z.number().optional(),
    name:  z.string().min(2, 'El nombre del producto es requerido'),
    description:  z.string().min(10, 'La descripción del producto es requerida'),
    price: z.coerce.number(),
});


type ProductForm = z.infer<typeof productosSchema>;

interface Props {
    open: boolean;
    onClose: () => void;
    products?: ProductForm | null;
    onSubmit: (data: ProductForm) => void;
}

const AddEditProductosDialog: React.FC<Props> = ({ open, onClose, products, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductForm>({
        resolver: zodResolver(productosSchema),
        defaultValues: products || { name: '', description: '', price: 0.00 },
    });

    const onFormSubmit = (data: ProductForm) => {
        onSubmit(data);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle color={"secondary"}><b>{products ? 'Editar Producto' : 'Agregar Producto'}</b></DialogTitle>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <DialogContent>
                    <TextField
                        {...register('name')}
                        id="labeltitulo"
                        label="Título"
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        {...register('description')}
                        id="labelcontenido"
                        label="Contenido"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                    <TextField
                        {...register('price')}
                        name="labelprecio"
                        id="labelprecio"
                        label="Precio"
                        fullWidth
                        margin="normal"
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color={"primary"} 
                    name="buttonCancelarAddProd"
                    id="buttonCancelarAddProd"
                    sx={{
                        backgroundColor: '#6f528a',
                        borderRadius: 10,
                        padding: 2,
                        margin:2,
                        alignItems: 'left',
                    }} onClick={onClose}><b>Cancelar</b></Button>
                    <Button color={"primary"} 
                    name="buttonOkAddProd"
                    id="buttonOkAddProd"
                    sx={{
                        backgroundColor: '#6f528a',
                        borderRadius: 10,
                        padding: 2,
                        margin:2,
                        alignItems: 'left',
                    }} type="submit"><b>{products ? 'Actualizar' : 'Agregar'}</b></Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddEditProductosDialog;