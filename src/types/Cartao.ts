import {Usuario} from "./Usuario";

export class Cartao {
    id: string;
    ativo: boolean;
    versao: number;
    usuario: Usuario;
    descricao: string;
    vencimentoFatura: Date;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.usuario = new Usuario();
        this.descricao = '';
        this.vencimentoFatura = new Date();
    }
}