import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteProductosDialog: React.FC<Props> = ({ open, onClose, onConfirm }) => {
    const handleDelete = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle color={"secondary"}><b>Confirmar Eliminación</b></DialogTitle>
            <DialogContent>
                ¿Estás seguro de que quieres eliminar este producto?
            </DialogContent>
            <DialogActions>
                <Button color={"primary"} 
                name="buttonCancelarDelProd"
                id="buttonCancelarDelProd"
                sx={{
                    backgroundColor: '#4a148c',
                    borderRadius: 10,
                    padding: 2,
                    margin:2,
                    alignItems: 'left',
                }} onClick={onClose}>Cancelar</Button>
                <Button color={"primary"} 
                name="buttonOkDelProd"
                id="buttonOkDelProd"
                sx={{
                    backgroundColor: '#aa00ff',
                    borderRadius: 10,
                    padding: 2,
                    margin:2,
                    alignItems: 'left',
                }} onClick={handleDelete}>Eliminar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteProductosDialog;