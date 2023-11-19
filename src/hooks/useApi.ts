import axios from 'axios';
import {Usuario} from "../types/Usuario";

const api = axios.create({
    baseURL: process.env.REACT_APP_API
})

const token = localStorage.getItem('token');

const authHeader = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export const useApi = () => ({
    validarToken: async (token: string): Promise<any> => {
        const response = await api.post("/auth/validate", {token});
        return response.data;
    },
    signin: async (email: string, senha: string) => {
        const response = await api.post("/auth/login", {email, senha});
        return response.data;
    },
    cadastrar: async (usuario: Usuario) => {
        const response = await api.post("/auth/cadastrar", usuario);
        return response.data;
    },
    listarGastos: async () => {
        const response = await api.get("/gastos", authHeader);
        return response.data;
    }
})