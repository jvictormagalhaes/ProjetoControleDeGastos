import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type FormEvent } from "react";

import { api } from '../../services/api';
import { Input } from "../componentes/Input";


export function PessoaEditar() {

    const { id } = useParams();
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [voltar, setVoltar] = useState(false);

    //navegação
    const navigate = useNavigate();

    //Função para buscar a pessoa pelo ID
    useEffect( () => {
     async function RetornarPessoa() {
        const response = await api.get(`/Pessoa/${id}`);

        setNome(response.data.nome);
        setIdade(response.data.idade);
     }

     RetornarPessoa();
    }, [])

    //Função para editar o cadastro pessoa
    async function EditarPessoa(e: FormEvent) {
        e.preventDefault();

        if(voltar){
            return;
        }

        if ((nome === '' || idade === '') && !voltar) {
            alert("Preencha todos os campos!");
            return;
        }
        
        if((Number(idade) < 1) && !voltar){
            alert("Idade deve ser maior que 0.");
            return;
        }

        const pessoaEditada = {
            id: Number(id),
            nome: nome,
            idade: Number(idade)
        };

        //Requisição para a edição do cadastro
        try {
            const response = await api.put(`/Pessoa/${id}`, pessoaEditada);

            if (response && response.status === 200) {
                alert("Cadastro editado com sucesso!") //Se a pessoa for editada, aparece a msg de sucesso
            }
            else {
                alert("Erro ao editar cadastro.") //Se der erro ao editar, aparece a msg de erro
            }
        }
        catch (error) {
            alert("Erro ao editar cadastro.") //Captura o erro ao editar
        }

        setNome("");
        setIdade("");

        //Retorna para a página de listagem de pessoas
        navigate("/pessoa");
    }

    //função voltar para listagem de pessoa
    function Voltar() {
        setVoltar(true);
        navigate('/pessoa');
    }

    return (
        <form onSubmit={EditarPessoa}>
            <div>
                {/* tiulo da página */}
                <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">
                    Editar Pessoa
                </h1>
            </div>

            {/* Inicio dos inputs para editar */}
            <div className="px-3 flex flex-col max-w-xs">
                <label className="text-white text-lg font-medium">Nome:</label>
                <Input placeholder="Digite seu nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <label className="text-white text-lg font-medium">Idade:</label>
                <Input placeholder="Digite sua idade"
                    type="number"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                />

                <div className="flex gap-2">
                     {/* Botão de Editar  */}
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={EditarPessoa}
                        type="submit">
                        Editar
                    </button>
                    
                     {/* Botão de Voltar */}
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={Voltar}>
                        Voltar
                    </button>
                </div>
            </div>
        </form>
    )
}
