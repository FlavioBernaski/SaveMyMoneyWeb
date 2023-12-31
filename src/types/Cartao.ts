import {Conta} from "./Conta";

export class Cartao {
    id: string;
    ativo: boolean;
    versao: number;
    conta: Conta;
    descricao: string;
    vencimentoFatura: number;
    limite: number;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.conta = new Conta();
        this.descricao = '';
        this.vencimentoFatura = 1;
        this.limite = 0;
    }
}