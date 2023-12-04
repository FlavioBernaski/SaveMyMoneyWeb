import axios from 'axios';
import {Usuario} from "../types/Usuario";
import {Cartao} from "../types/Cartao";
import {Conta} from "../types/Conta";
import {useMemo} from "react";
import {Movimentacao} from "../types/Movimentacao";

const api = axios.create({
    baseURL: process.env.REACT_APP_API
})
api.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
api.defaults.headers.get['Accept'] = 'application/json;charset=utf-8';

const getHeader = () => {
    return ({
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    )
}

export const useApi = () => useMemo(() => ({
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
        const response = await api.get("/movimentacoes", getHeader());
        return response.data;
    },
    cadastrarMovimentacao: async (movimentacao: Movimentacao) => {
        const response = await api.post('/movimentacoes', movimentacao, getHeader());
        return response.data;
    },
    // Cartões
    listarCartoes: async () => {
        const response = await api.get("/cartoes", getHeader());
        return response.data;
    },
    listarCartoesPorConta: async (idConta: string) => {
        const response = await api.get("/cartoes/conta/" + idConta, getHeader());
        return response.data;
    },
    excluirCartao: async (id: string) => {
        const response = await api.delete("/cartoes/" + id, getHeader());
        return response.data;
    },
    cadastrarCartao: async (cartao: Cartao) => {
        const response = await api.post("/cartoes", cartao, getHeader());
        return response.data;
    },
    localizarCartao: async (idCartao: string) => {
        const response = await api.get('/cartoes/' + idCartao, getHeader());
        return response.data;
    },
    // Contas
    listarContas: async () => {
        const response = await api.get('/contas', getHeader());
        return response.data;
    },
    cadastrarConta: async (conta: Conta) => {
        const response = await api.post('/contas', conta, getHeader());
        return response.data;
    },
    localizarConta: async (idConta: string) => {
        const response = await api.get('/contas/' + idConta, getHeader());
        return response.data;
    },
    excluirConta: async (id: string) => {
        const response = await api.delete("/contas/" + id, getHeader());
        return response.data;
    }
}), []); // Fecha useMemo