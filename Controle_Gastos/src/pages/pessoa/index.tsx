import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { Input } from "../componentes/Input"

import { api } from '../../services/api'

interface PessoaProps {
  id: number;
  nome: string;
  idade: number;
}

export function Pessoa() {

  const [pessoas, setPessoas] = useState<PessoaProps[]>([]);
  const [pessoasFiltradas, setPessoasFiltradas] = useState<PessoaProps[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [ID, setID] = useState(Number);
  const [deletar, setDeletar] = useState(false);

  //navegação
  const navigate = useNavigate();

  //Requisição para listagem de pessoas
  useEffect( () => {
    async function RetornarPessoas() {
      const response = await api.get("/Pessoa");
      setPessoasFiltradas(response.data);
      setPessoas(response.data)
    }

    RetornarPessoas();
  }, [])

  //filtro para pesquisa de pessoas na listagem
  useEffect(() => {
    const resultado = pessoas.filter((pessoa) =>
      pessoa.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      pessoa.id.toString().includes(pesquisa) ||
      pessoa.idade.toString().includes(pesquisa)
    );

    setPessoasFiltradas(resultado);
  }, [pesquisa, pessoas]);

  //nagaveção para a página de cadastro
  function CadastrarPessoa() {
    navigate('/pessoa-cadastrar');
  }

  //navegação para a página de edição
  function EditarPessoa(id:number) {
    navigate(`/pessoa-editar/${id}`);
  }

  //captura de id para edição/deleção do registro da pessoa
  function CapturarID(id: number) {
    setID(id);
    setDeletar(true);
  }

  //função de deleção de pessoa
  async function DeletarPessoa() {
    setDeletar(false);

    try {
      const response = await api.delete(`/Pessoa/${ID}`);

      if (response && response.status === 200) {
        setPessoas(pessoas.filter(pessoa => pessoa.id !== response.data.id));

        alert("Cadastro deletado com sucesso !");
      }
      else {
        alert("Erro ao deletar cadastro.");
      }
    }
    catch (Exception) {
      console.log(Exception + "Erro ao deletar cadastro.");
    }
  }

  return (
    <div className="flex flex-col">
      <div>
        {/* titulo da página */}
        <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">Lista de Pessoas</h1>
      </div>

      <div className="flex flex-row  justify-between">
        {/* Botão de cadastro */}
        <div className="px-3 py-1">
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 border rounded-md text-sm" onClick={CadastrarPessoa}>
            Cadastrar Novo
          </button>
        </div>

        {/* Input de pesquisa */}
        <div className="flex flex-1 px-3 py-1">
          <Input className="w-full border h-9 rounded-md outline-none px-2 mb-1 bg-amber-50"
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)} />
        </div>
      </div>

      <div className="px-3">

        {/* Inicio da tabela */}
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          {/* Inicio do cabeçalho da tabela */}
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 w-1/2 border">Nome</th>
              <th className="px-4 py-2 border">Idade</th>
              <th className="px-4 border text-center">Ações</th>
            </tr>
          </thead>
          {/* Fim do cabeçalho da tabela */}

          {/* Inicio do corpo da tabela */}
          <tbody>

            {pessoasFiltradas.map((pessoa) => (
              <tr key={pessoa.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-4 py-2 border text-center ">{pessoa.id}</td>
                <td className="px-4 py-2 border">{pessoa.nome}</td>
                <td className="px-4 py-2 border text-center">{pessoa.idade}</td>

                <td className="px-4 py-2 border">
                  <div className="flex justify-center gap-2">
                    {/* Botão para editar registro */}
                    <button
                      className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-800 cursor-pointer text-xs"
                      onClick={() => EditarPessoa(pessoa.id)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>

                    <div>
                      {/* Botão que abre a confirmação da deleção */}
                      <button
                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-800 cursor-pointer text-xs"
                        onClick={() => CapturarID(pessoa.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                      {/* Confirmação de deleção do ID selecionado*/}
                      {deletar && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                          onClick={() => setDeletar(false)}>
                            {/* stopPropagation impede que o clique continue para elementos pai, no caso, a div.*/}
                          <div
                            className="bg-white rounded-lg p-6 w-80 shadow-lg"
                            onClick={e => e.stopPropagation()}>

                            <h2 className="text-xl font-bold mb-4">Excluir registro.</h2>
                            <p className="mb-6">Deseja realmente excluir esta pessoa?</p>

                            <div className="flex justify-end gap-3">
                              {/*Botão cancelar da confirmação de deleção*/}
                              <button
                                className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-800"
                                onClick={() => setDeletar(false)}>
                                Cancelar
                              </button>

                              {/*Botão confirmar da confirmação de deleção*/}
                              <button
                                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-800"
                                onClick={() => DeletarPessoa()}>
                                Confirmar
                              </button>

                            </div>
                          </div>
                        </div>
                      )}
                      {/* Fim da confirmação de deleção do ID selecionado*/}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            
          </tbody>
          {/* Fim do corpo da tabela */}

        </table>
        {/* Fim da tabela */}

      </div>
    </div>
  )
}
