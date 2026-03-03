import { useNavigate } from "react-router-dom"
import { useEffect, useState, type FormEvent } from "react"

import { api } from '../../services/api'
import { Input } from "../componentes/Input";

export function PessoaCadastrar() {

    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const corMensagem = tipoMensagem === 'sucesso' ? 'text-green-600' : 'text-red-600';
    const [voltar, setVoltar] = useState(false);

    //navegação
    const navigate = useNavigate();

    //Função para cadastrar pessoa
    async function CadastrarPessoa(e: FormEvent) {
        e.preventDefault();

        if ((nome === '' || idade === '') && !voltar) {
            alert("Preencha todos os campos!");
            return;
        }
        
        if((Number(idade) < 1) && !voltar){
            alert("Idade deve ser maior que 0.");
            return;
        }

        const novaPessoa = {
            nome: nome,
            idade: Number(idade)
        };

        //requisição para criar nova pessoa
        try {
            const response = await api.post("/Pessoa", novaPessoa);

            if (response && response.status === 201) {
                setMensagem("Cadastro realizado com sucesso!"); //Se a pessoa for criada, aparece a msg de sucesso
                setTipoMensagem("sucesso");
            }
            else {
                setMensagem("Erro ao cadastrar."); //Se der erro ao criar, aparece a msg de erro
                setTipoMensagem("erro");
            }

        }
        catch (error) { //Captura o erro ao criar pessoa
            setMensagem("Erro ao cadastrar.");
            setTipoMensagem("erro");
        }

        setNome("");
        setIdade("");
    }

    //função voltar para listagem de pessoa
    function Voltar() {
        setVoltar(true);
        navigate('/pessoa');
    }
    
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
        <form onSubmit={CadastrarPessoa}>
            <div>
                {/* tiulo da página */}
                <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">
                    Cadastrar Pessoa
                </h1>
            </div>

            {/* Inicio dos inputs para criar uma pessoa  */}
            <div className="px-3 flex flex-col max-w-xs">
                <label className="text-white text-lg font-medium">Nome:</label>
                <Input placeholder="Digite o nome..."
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <label className="text-white text-lg font-medium">Idade:</label>
                <Input placeholder="Digite a idade..."
                    type="number"
                    value={idade}
                    min={1}
                    onChange={(e) => setIdade(e.target.value)}
                />

                <div className="flex gap-2">
                    {/* Botão de Cadastrar*/}
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={CadastrarPessoa}
                        type="submit">
                        Cadastrar
                    </button>

                    {/* Botão de Voltar*/}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={Voltar}>
                        Voltar
                    </button>
                </div>

                 {/* Mensagem de sucesso/erro de cadastro de categoria*/}
                {mensagem && (
                    <h1 className={`${corMensagem} font-bold px- py-2 my-4 rounded-md text-center bg-gray-100`}>
                        {mensagem}
                    </h1>
                )}

            </div>
        </form>
    )
}
