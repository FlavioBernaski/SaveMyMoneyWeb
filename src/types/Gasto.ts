import {Usuario} from "./Usuario";
import {Cartao} from "./Cartao";

export type Gasto = {
    id: string,
    ativo: boolean,
    versao: number,
    usuario: Usuario
    descricao: string,
    valor: number,
    dataEntrada: Date,
    parcelas: number,
    cartao: Cartao
}