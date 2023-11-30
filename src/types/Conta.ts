import {Usuario} from "./Usuario";

export class Conta {
    id: string;
    ativo: boolean;
    versao: number;
    usuario: Usuario;
    descricao: string;
    saldo: number;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.usuario = new Usuario();
        this.descricao = '';
        this.saldo = 0;
    }
}