export type Usuario = {
    id: string;
    ativo: boolean;
    versao: number;
    nome: string;
    email: string;
    senha?: string;
}