import {Cartao} from "./Cartao";
import {Conta} from "./Conta";

export class Renda {
    id: string;
    ativo: boolean;
    versao: number;
    conta: Conta;
    descricao: string;
    valor: number;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.conta = new Conta();
        this.descricao = '';
        this.valor = 0;
    }
}