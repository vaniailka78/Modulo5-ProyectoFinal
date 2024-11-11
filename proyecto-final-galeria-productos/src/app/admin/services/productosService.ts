import axios, {AxiosResponse} from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Productos {
    id: number;
    name: string;
    description: string;
    price: number;
}

export interface ProductsResponse {
    productsList: Productos[];
    totalCount: number;
}


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
    },
});

export const fetchProductos = async (page: number = 1, pageSize: number = 10): Promise<ProductsResponse> => {
    const response: AxiosResponse<ProductsResponse> = await api.get('/api/products', {
        params: {
            page,
            pageSize
        }
    });
    return response.data;
};

export const addProductos = async (products: Omit<Productos, 'id'>): Promise<Productos> => {
    const response = await api.post('/api/products', products);
    return response.data;
};

export const updateProductos = async (product: Productos): Promise<Productos> => {
    const response = await api.patch(`/api/products/${product.id}`, product);
    return response.data;
};

export const deleteProductos = async (id: number): Promise<void> => {
    await api.delete(`/api/products/${id}`);
};
