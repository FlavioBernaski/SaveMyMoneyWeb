import {Cartao} from "./Cartao";
import {Conta} from "./Conta";

export class Movimentacao {
    id: string;
    ativo: boolean;
    versao: number;
    conta: Conta;
    descricao: string;
    valor: number;
    dataEntrada: Date;
    parcelas: number;
    parcelaAtual: number;
    tipo: 'S' | 'E';
    cartao: Cartao;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.conta = new Conta();
        this.descricao = '';
        this.valor = 0;
        this.dataEntrada = new Date();
        this.parcelas = 0;
        this.parcelaAtual = 0;
        this.tipo = 'S';
        this.cartao = new Cartao();
    }
}