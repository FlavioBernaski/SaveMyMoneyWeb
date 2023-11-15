import {Usuario} from "../../types/Usuario";
import {createContext} from "react";

export type AuthContextType = {
    usuario: Usuario | null;
    signin: (email: string, senha: string) => Promise<boolean>;
    signout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!)