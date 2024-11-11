
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin } from '../lib/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
    email: string;
    sub: number,
    iat: number,
    exp: number,
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        Cookies.remove('token');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    Cookies.remove('token');
                }
            }
        };

        fetchUser();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const token = await authLogin(username, password);
            Cookies.set('token', token, { expires: 7 });
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                router.push('/admin');
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};