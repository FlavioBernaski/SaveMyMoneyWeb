import {AuthContext} from "./AuthContext";
import {useEffect, useState} from "react";
import {Usuario} from "../../types/Usuario";
import {useApi} from "../../hooks/useApi";
import {AxiosError} from "axios";

export const AuthProvider = ({children}: { children: JSX.Element }) => {

    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const api = useApi();

    useEffect(() => {
        try {
            if (usuario == null) {
                const validateToken = async () => {
                    const storageData = localStorage.getItem('token');
                    if (storageData) {
                        const data = await api.validarToken(storageData);
                        console.log(data)
                        if (data.id) {
                            setUsuario(data);
                        }
                    }
                }
                validateToken()
            }
        } catch (e) {
            console.error(e);
        }
    }, [api, usuario]);

    const signin = async (email: string, senha: string) => {
        try {
            const data = await api.signin(email, senha);
            if (data.usuario && data.token) {
                setUsuario(data.usuario);
                setToken(data.token);
                return true;
            }
            return false;
        } catch (e: any) {
            if (e instanceof AxiosError && e.response !== undefined) {
                return e.response.data.message;
            }
            console.error(e);
            return "Erro desconhecido";
        }
    }

    const setToken = (token: string) => {
        localStorage.setItem('token', token)
    }

    const signout = async () => {
        setUsuario(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{usuario, signin, signout}}>
            {children}
        </AuthContext.Provider>
    )
}