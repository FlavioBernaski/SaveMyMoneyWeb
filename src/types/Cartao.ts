import {Usuario} from "./Usuario";

export type Cartao = {
    id: string,
    ativo: boolean,
    versao: number,
    usuario: Usuario,
    descricao: string,
    vencimentoFatura: Date
}