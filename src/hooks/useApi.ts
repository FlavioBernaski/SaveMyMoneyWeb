import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API
})

const token = localStorage.getItem('token');

const authHeader = {
    headers: {
        'Authorization' : `Bearer ${token}`
    }
}

export const useApi = () => ({
    validarToken: async (token: string) => {
        try {
            const response = await api.post("/auth/validate", {token});
            return response.data;
        } catch (e) {
            return e;
        }
    },
    signin: async (email: string, senha: string) => {
        try {
            const response = await api.post("/auth/login", {email, senha});
            return response.data;
        } catch (e) {
            return e;
        }
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    }
})