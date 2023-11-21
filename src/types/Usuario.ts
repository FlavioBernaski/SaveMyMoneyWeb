export class Usuario {
    id: string;
    ativo: boolean;
    versao: number;
    nome: string;
    email: string;
    senha?: string;

    constructor() {
        this.id = '';
        this.ativo = true;
        this.versao = Date.now();
        this.nome = '';
        this.email = '';
        this.senha = '';
    }
}