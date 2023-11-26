import {Usuario} from "./Usuario";

export class Cartao {
    id: string;
    ativo: boolean;
    versao: number;
    usuario: Usuario;
    descricao: string;
    vencimentoFatura: number;
    limite: number;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.usuario = new Usuario();
        this.descricao = '';
        this.vencimentoFatura = 1;
        this.limite = 0;
    }
}