import axios from 'axios';
import {Usuario} from "../types/Usuario";
import {Cartao} from "../types/Cartao";

const api = axios.create({
    baseURL: process.env.REACT_APP_API
})
api.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.get['Content-Type'] ='application/json;charset=utf-8';
api.defaults.headers.get['Accept'] ='application/json;charset=utf-8';
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
    login: async (email: string, senha: string) => {
        const response = await api.post("/auth/login", {email, senha});
        return response.data;
    },
    signin: async (usuario: Usuario) => {
        const response = await api.post("/auth/cadastrar", usuario);
        return response.data;
    },
    listarGastos: async () => {
        const response = await api.get("/gastos", authHeader);
        return response.data;
    },
    cadastrarCartao: async (cartao: Cartao) => {
        const response = await api.post("/cartoes", cartao, authHeader)
        return response.data;
    }
})