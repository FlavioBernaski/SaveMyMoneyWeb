import axios from 'axios';
import {Usuario} from "../types/Usuario";
import {Cartao} from "../types/Cartao";
import {Conta} from "../types/Conta";

const api = axios.create({
    baseURL: process.env.REACT_APP_API
})
api.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
api.defaults.headers.get['Accept'] = 'application/json;charset=utf-8';
const token = localStorage.getItem('token');

const authHeader = {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}

export const useApi = () => ({
    // Autorizações
    validarToken: async (token: string): Promise<any> => {
        const response = await api.post("/auth/validate", {token});
        return response.data;
    },
    login: async (email: string, senha: string) => {
        const response = await api.post("/auth/login", {email, senha});
        return response.data;
    },
    signin: async (usuario: Usuario) => {
        const response = await api.post("/auth/register", usuario);
        return response.data;
    },
    // Movimentações
    listarMovimentacoes: async () => {
        const response = await api.get("/movimentacoes", authHeader);
        return response.data;
    },
    // Cartões
    listarCartoes: async () => {
        const response = await api.get("/cartoes", authHeader);
        return response.data;
    },
    excluirCartao: async (id: string) => {
        const response = await api.delete("/cartoes/" + id, authHeader);
        return response.data;
    },
    cadastrarCartao: async (cartao: Cartao) => {
        const response = await api.post("/cartoes", cartao, authHeader);
        return response.data;
    },
    // Contas
    listarContas: async () => {
        const response = await api.get('/contas', authHeader);
        return response.data;
    },
    cadastrarConta: async (conta: Conta) => {
        const response = await api.post('/contas', conta, authHeader);
        return response.data;
    },
    localizarConta: async (idConta: string) => {
        const response = await api.get('/contas/' + idConta, authHeader);
        return response.data;
    },
    excluirConta: async (id: string) => {
        const response = await api.delete("/contas/" + id, authHeader);
        return response.data;
    }
})