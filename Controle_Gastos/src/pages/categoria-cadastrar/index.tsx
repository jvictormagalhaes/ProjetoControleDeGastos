import { useNavigate } from "react-router-dom"
import { useEffect, useState, type FormEvent } from "react"

import { api } from '../../services/api';
import { Input } from "../componentes/Input";


export function CategoriaCadastrar() {

    const [descricao, setDescricao] = useState("");
    const [finalidade, setFinalidade] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");
    const corMensagem = tipoMensagem === 'sucesso' ? 'text-green-600' : 'text-red-600';
    const [voltar, setVoltar] = useState(false);

    //navegação da página
    const navigate = useNavigate();

    //Função de cadastro de Categoria
    async function CadastrarCategoria(e: FormEvent) {
        e.preventDefault();

        //Voltar serve para que não apareça o alert em caso de apenas clique para voltar
        if ((descricao === '' || Number(finalidade) === 0 ) && !voltar) {
            alert("Preencha todos os campos!");
            return;
        }
        
        if((Number(finalidade) < 1) && !voltar){
            alert("Selecione uma finalidade.");
            return;
        }

        const novaCategoria = {
            descricao: descricao,
            finalidade: Number(finalidade)
        };

        //Request para criar a nova categoria
        try {
            const response = await api.post("/Categoria", novaCategoria);

            if (response && response.status === 201) { //Se a categoria for criada, aparece a msg de sucesso
                setMensagem("Cadastro realizado com sucesso!");
                setTipoMensagem("sucesso");
            }
            else {
                setMensagem("Erro ao cadastrar."); //Se houver erro ao criar, aparece a msg de erro.
                setTipoMensagem("erro");
            }

        }
        catch (error) { //Captura o erro ao criar
            setMensagem("Erro ao cadastrar.");
            setTipoMensagem("erro");
        }

        setDescricao("");
        setFinalidade("");
    }

    function Voltar() { //função voltar para listagem de categoria
        setVoltar(true);
        navigate('/categoria');
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
        <form onSubmit={CadastrarCategoria}>
            <div>
                {/* tiulo da página */}
                <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">
                    Cadastrar Categoria
                </h1>
            </div>

            {/* Inicio dos inputs para criar a categoria  */}
            <div className="px-3 flex flex-col max-w-xs">
                <label className="text-white text-lg font-medium">Descrição:</label>
                <Input placeholder="Digite a descrição..."
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                <label className="text-white text-lg font-medium">Finalidade:</label>
                <select value={finalidade} className="border-black h-9 rounded-md outline-none px-2 mb-1 bg-amber-50 text-gray-500"
                    onChange={(e) => setFinalidade(e.target.value)}>
                    <option value="">Selecione a finalidade</option>
                    <option value="1">1 - Despesa</option>
                    <option value="2">2 - Receita</option>
                </select>

                <div className="flex gap-2">
                    {/* Botão de Cadastrar*/}
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 mt-1 rounded-md border text-sm w-fit"
                        onClick={CadastrarCategoria}
                        type="submit">
                        Cadastrar
                    </button>
                    
                    {/* Botao de Voltar */}
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
