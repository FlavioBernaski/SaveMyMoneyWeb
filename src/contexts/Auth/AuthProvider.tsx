import {AuthContext} from "./AuthContext";
import {useEffect, useState} from "react";
import {Usuario} from "../../types/Usuario";
import {useApi} from "../../hooks/useApi";

export const AuthProvider = ({ children }: {children: JSX.Element}) => {

    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const api = useApi();

    useEffect(() => {
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
    }, [api]);

    const signin = async (email: string, senha: string) => {
        const data = await api.signin(email, senha);
        if (data.usuario && data.token) {
            setUsuario(data.usuario);
            setToken(data.token);
            return true;
        }
        return false;
    }

    const setToken = (token: string) => {
        localStorage.setItem('token', token)
    }

    const signout = async () => {
        await api.logout();
        setUsuario(null);
    }

    return (
        <AuthContext.Provider value={{ usuario, signin, signout }}>
            {children}
        </AuthContext.Provider>
    )
}