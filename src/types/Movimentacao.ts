import {Usuario} from "./Usuario";
import {Cartao} from "./Cartao";

export type Movimentacao = {
    id: string,
    ativo: boolean,
    versao: number,
    usuario: Usuario
    descricao: string,
    valor: number,
    dataEntrada: Date,
    parcelas: number,
    parcelaAtual: number,
    tipo: 'S' | 'E',
    cartao: Cartao
}