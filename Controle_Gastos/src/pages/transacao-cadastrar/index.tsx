import { useNavigate } from "react-router-dom"
import { useEffect, useState, type FormEvent } from "react"

import { api } from '../../services/api';
import { Input } from "../componentes/Input";

interface PessoaProps {
    id: number;
    nome: string;
    idade: number;
}

interface CategoriaProps {
    id: number;
    descricao: string;
    finalidade: number;
}

export function TransacaoCadastrar() {

    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState<number>(0);
    const [tipo, setTipo] = useState<number>(0);
    const [pessoaID, setPessoaID] = useState<number>(0);
    const [categoriaID, setCategoriaID] = useState<number>(0);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const corMensagem = tipoMensagem === 'sucesso' ? 'text-green-600' : 'text-red-600';
    const [voltar, setVoltar] = useState(false);

    const [pessoas, setPessoas] = useState<PessoaProps[]>([]);
    const [categorias, setCategoria] = useState<CategoriaProps[]>([]);

    const [buscaPessoa, setBuscaPessoa] = useState("");
    const [listaPessoa, setListaPessoa] = useState<PessoaProps[]>([]);

    const [buscaCategoria, setBuscaCategoria] = useState("");
    const [listaCategoria, setListaCategoria] = useState<CategoriaProps[]>([]);

    const [maiorIdade, setMaiorIdade] = useState<boolean>(false);

    //navegação
    const navigate = useNavigate();

    //Função de cadastro de Transação
    async function CadastrarTransacao(e: FormEvent) {
        e.preventDefault();

        if ((descricao === '')
            && !voltar) {
            alert("Informe um nome!");
            return;
        }

        if (Number(valor) < 1 && !voltar) {
            alert("Valor deve ser maior que 0.");
            return;
        }

        if (Number(pessoaID) < 1 && !voltar) {
            alert("Seleciona uma pessoa.");
            return;
        }

        if (Number(tipo) < 1 && !voltar) {
            alert("Selecione uma finalidade.");
            return;
        }

        if (Number(categoriaID) < 1 && !voltar) {
            alert("Selecione uma categoria.");
            return;
        }

        const novaTransacao = {
            descricao: descricao,
            valor: valor,
            tipo: tipo,
            pessoaId: pessoaID,
            categoriaId: categoriaID
        };

        //Request para criar a nova Transacao
        try {
            const response = await api.post("/Transacao", novaTransacao);

            if (response && response.status === 201) {
                setMensagem("Cadastro realizado com sucesso!"); //Se a transacao for criada, aparece a msg de sucesso
                setTipoMensagem("sucesso");
            }
            else {
                if(response.status === 400){
                    alert("Menor de idade não pode ter receita."); //Erro devido a idade ser menor que 18, aparece a msg de erro.
                    setMensagem("Erro ao cadastrar.");
                    setTipoMensagem("erro");
                }
                else{
                    setMensagem("Erro ao cadastrar."); //Se houver erro ao criar, aparece a msg de erro.
                    setTipoMensagem("erro");
                }
            }
        }
        catch (error) { //Captura o erro ao criar
            setMensagem("Erro ao cadastrar.");
            setTipoMensagem("erro");
        }

        setDescricao("");
        setTipo(0);
        setValor(0);
        setPessoaID(0);
        setCategoriaID(0);
        setBuscaPessoa("");
        setBuscaCategoria("");

        setListaPessoa([]);
        setListaCategoria([]);
    }

    //função voltar para listagem de categoria
    function Voltar() {
        setVoltar(true);
        navigate('/transacao');
    }

    //função para pesquisar o nome digitado na lista de pessoas que aparecem no input de pessoa
    function pesquisarPessoa(nome: string) {

        setBuscaPessoa(nome);

        const resultado = pessoas.filter(pessoa =>
            pessoa.nome.toLowerCase().includes(nome.toLowerCase())
        );

        setListaPessoa(resultado);
    }

    //função para selecionar o nome digitado na lista de pessoas que aparecem no input de pessoa
    function selecionarPessoa(pessoa: PessoaProps) {

        setPessoaID(pessoa.id);
        setBuscaPessoa(pessoa.nome);
        setListaPessoa([]);

        //se a pessoa selecionada tiver idade menor que 18, o valor de despesa já é informado automaticamente
        if (pessoa.idade < 18) {
            setTipo(1);
        }
    }

    //função para selecionar a descrição digitada na lista de categorias que aparecem no input
    function pesquisarCategoria(descricao: string) {

        setBuscaCategoria(descricao);

        //filtra apenas a categoria de acordo com a finalidade selecionada (se finalidade 1, apenas despesas; se finalidade 2, apenas receitas)
        const resultado = categorias.filter(categoria =>
            categoria.finalidade === tipo && categoria.descricao.toLowerCase().includes(descricao.toLowerCase())
        );

        setListaCategoria(resultado);
    }

    //função para selecionar a descrição na lista de categorias que aparecem no input
    function selecionarCategoria(categoria: CategoriaProps) {

        setCategoriaID(categoria.id);
        setBuscaCategoria(categoria.descricao);
        setListaCategoria([]);
    }

    //Retono da API com valores de Pessoa
    useEffect(() => {
        async function RetornarPessoa() {
            const response = await api.get("/Pessoa");
            setPessoas(response.data)
        }

        RetornarPessoa();
    }, [])

    //Retono da API com valores da categoria
    useEffect(() => {
        async function RetornarCategoria() {
            const response = await api.get("/Categoria");
            setCategoria(response.data)
        }

        RetornarCategoria();
    }, [tipo])

    //Verifica a idade da pessoa com base na pessoa selecionada
    useEffect(() => {

        async function VerificarIdade() {
            if (pessoaID === 0) return;
            const response = await api.get(`/Pessoa/${pessoaID}`);
            setMaiorIdade(response.data.idade >= 18);
        }

        VerificarIdade();
        setCategoria([]);
        setBuscaCategoria("");

    }, [pessoaID]);

    //Timer para que a msg de sucesso/erro desapareça depois de 2.2s
    useEffect(() => {
        if (mensagem) {
            const timer = setTimeout(() => {
                setMensagem("");
            }, 2200);

            return () => clearTimeout(timer);
        }
    }, [mensagem]);


    return (
        <form onSubmit={CadastrarTransacao}>
            <div>
                 {/* tiulo da página */}
                <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">
                    Cadastrar Transação
                </h1>
            </div>

            {/* Inicio dos inputs para criar a categoria  */}
            <div className="px-3 flex flex-col max-w-xs">
                {/* Input de Descrição da transação */}
                <label className="text-white text-lg font-medium">Descrição:</label>
                <Input placeholder="Digite a descrição..."
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                {/* Input de Valor */}
                <label className="text-white col-1/2 text-lg font-medium">Valor:</label>
                <Input placeholder="Digite o valor..."
                    type="number"
                    value={valor}
                    min={1}
                    onChange={(e) => setValor(Number(e.target.value))}
                />

                {/* Input de Pessoa */}
                <label className="text-white text-lg font-medium">Pessoa:</label>
                <div className="relative">
                    <Input
                        placeholder="Selecione a pessoa..."
                        value={buscaPessoa}
                        onChange={(e) => pesquisarPessoa(e.target.value)}
                    />
                    
                    {/* Gera uma lista de pessoas para escolher um registro*/}
                    {listaPessoa.length > 0 && (
                        <ul className=" bg-white border w-full max-h-40 overflow-y-auto text-black">
                            {listaPessoa.map((pessoa) => (
                                <li
                                    key={pessoa.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => selecionarPessoa(pessoa)}
                                >
                                    {pessoa.nome}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                {/* Input de Tipo/Finalidade */}
                <label className="text-white text-lg font-medium">Tipo:</label>
                <select value={tipo} className="border-black h-9 rounded-md outline-none px-2 mb-1 bg-amber-50 text-gray-500"
                    onChange={(e) => setTipo(Number(e.target.value))}>
                    <option value="">Selecione o tipo</option>
                    <option value="1">1 - Despesa</option>
                    {maiorIdade && (<option value="2">2 - Receita</option>)} {/* opção de Receita só aparece para pessoas maiores de 18 anos */}
                </select>
                
                {/* Input de categoria, input só aparece depois que uma finalidade é informada */}
                {tipo !== 0 && (
                    <label className="text-white text-lg font-medium">Categoria:</label>
                )}

                {/* Input de Categoria */}
                {tipo !== 0 && (
                    <div className="relative">
                        <Input
                            placeholder="Selecione a categoria..."
                            value={buscaCategoria}
                            onChange={(e) => pesquisarCategoria(e.target.value)}
                        />
                        
                        {/* Gera uma lista de categorias, com base na finalidade, para escolher um registro*/}
                        {listaCategoria.length > 0 && (
                            <ul className=" bg-white border w-full max-h-40 overflow-y-auto text-black">
                                {listaCategoria.map((categoria) => (
                                    <li
                                        key={categoria.id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => selecionarCategoria(categoria)}
                                    >
                                        {categoria.descricao}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div className="flex gap-2">
                    {/* Botão de cadastrar */}
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={CadastrarTransacao}
                        type="submit">
                        Cadastrar
                    </button>

                    {/* Botão de Voltar */}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={Voltar}>
                        Voltar
                    </button>
                </div>
                 
                 {/* Mensagem de sucesso/erro de cadastro de transação*/}
                {mensagem && (
                    <h1 className={`${corMensagem} font-bold px- py-2 my-4 rounded-md text-center bg-gray-100`}>
                        {mensagem}
                    </h1>
                )}

            </div>
        </form>
    )
}
