
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginResponse {
    access_token: string;
}

export const login = async (email: string, password: string) => {
    try {
        console.log(email);
        console.log(password);
        console.log(`${API_URL}/api/auth/login`);

        const response = await axios.post<LoginResponse>(`${API_URL}/api/auth/login`, {
            email,
            password,
        });
        console.log(response.data.access_token);

        return response.data.access_token;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};