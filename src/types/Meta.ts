import {Usuario} from "./Usuario";

export class Meta {
    id: string;
    ativo: boolean;
    versao: number;
    usuario: Usuario;
    descricao: string;
    valor: number;
    tipo: 'f' | 's';

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.usuario = new Usuario();
        this.descricao = '';
        this.valor = 0;
        this.tipo = 'f';
    }
}