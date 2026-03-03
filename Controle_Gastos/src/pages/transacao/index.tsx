import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Input } from "../componentes/Input";

import { api } from '../../services/api';

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

interface TransacaoProps {
  id: number;
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: number;
  categoriaId: number;
  pessoa: PessoaProps;
  categoria: CategoriaProps;
}

export function Transacao() {

  const [transacoes, setTransacoes] = useState<TransacaoProps[]>([]);
  const [transacoesFiltradas, setTransacoesFiltradas] = useState<TransacaoProps[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  //navegação
  const navigate = useNavigate();

  //Requisição para listagem de transações
  useEffect(() => {
    async function RetornarTransacao() {
      const response = await api.get("/Transacao");
      setTransacoesFiltradas(response.data);
      setTransacoes(response.data)
    }

    RetornarTransacao();
  }, [])

  //filtro para pesquisa de transação na listagem
  useEffect(() => {
    const resultado = transacoes.filter((transacao) =>
      transacao.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
      transacao.id.toString().includes(pesquisa) ||
      transacao.tipo.toString().includes(pesquisa) ||
      transacao.valor.toString().includes(pesquisa) ||
      transacao.pessoaId.toString().includes(pesquisa) ||
      transacao.categoriaId.toString().includes(pesquisa)
    );

    setTransacoesFiltradas(resultado);
  }, [pesquisa, transacoes]);

  //nagaveção para a página de cadastro
  function CadastrarTransacao() {
    navigate('/transacao-cadastrar');
  }

  //Função para formatar o valor em real. exemplo: (R$ 0,00)
  function FormatarValor(valor: number){

    const valorFormatado = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          });

    return valorFormatado.format(valor);
  }

  return (
    <div className="flex flex-col">
      <div>
        {/* titulo da página */}
        <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">Lista de Transações</h1>
      </div>

      <div className="flex flex-row  justify-between">
        {/* Botão de cadastro */}
        <div className="px-3 py-1">
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 border rounded-md text-sm" onClick={CadastrarTransacao}>
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
              <th className="px-4 py-2 w-1/2 border">Descrição</th>
              <th className="px-4 py-2 border">Valor</th>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Pessoa</th>
              <th className="px-4 py-2 border">Categoria</th>
            </tr>
          </thead>
          {/* Fim do cabeçalho da tabela */}

          {/* Inicio do corpo da tabela */}
          <tbody>
            {transacoesFiltradas.map((transacao) => (
              <tr key={transacao.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-4 py-2 border text-center ">{transacao.id}</td>
                <td className="px-4 py-2 border">{transacao.descricao}</td>
                <td className="px-4 py-2 border">{FormatarValor(transacao.valor)}</td>
                <td className="px-4 py-2 border text-center">{(transacao.tipo == 1 ? "Despesa" : "Receita" )}</td>
                <td className="px-4 py-2 border text-center">{transacao.pessoa.nome}</td>
                <td className="px-4 py-2 border text-center">{transacao.categoria.descricao}</td>
              </tr>
            ))}
          </tbody>
          {/* Fim do corpo da tabela */}
        </table>
        {/* Fim  da tabela */}
      </div>
    </div>
  )
}
