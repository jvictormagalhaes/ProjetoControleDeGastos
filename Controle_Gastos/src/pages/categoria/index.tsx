import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Input } from "../componentes/Input";

import { api } from '../../services/api';

interface CategoriaProps {
  id: number;
  descricao: string;
  finalidade: number;
}

export function Categoria() {

  const [categorias, setCategoria] = useState<CategoriaProps[]>([]);
  const [categoriaFiltradas, setCategoriaFiltradas] = useState<CategoriaProps[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  //hook do react router para navegat as paginas
  const navigate = useNavigate();

  //Retono da API com valores da categoria
  useEffect(() => {
    async function RetornarCategoria() {
      const response = await api.get("/Categoria");
      setCategoriaFiltradas(response.data);
      setCategoria(response.data)
    }

    RetornarCategoria();
  }, [])

  //Filtro do input de pesquisa de categoria
  useEffect(() => {
    const resultado = categorias.filter((categoria) =>
      categoria.descricao.toLowerCase().includes(pesquisa.toLowerCase()) ||
      categoria.id.toString().includes(pesquisa) ||
      categoria.finalidade.toString().includes(pesquisa)
    );

    setCategoriaFiltradas(resultado);
  }, [pesquisa, categorias]);

  //Navegação para a página de cadastro
  function CadastrarCategoria() {
    navigate('/categoria-cadastrar');
  }

  return (
    <div className="flex flex-col">
      {/* Título da página */}
      <div>
        <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">Lista de Categorias</h1>
      </div>

      {/* Corpo da página */}
      <div className="flex flex-row  justify-between">
        <div className="px-3 py-1">

          {/* Botão de Cadastro, para redirecionar para a página de cadastro*/}
          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 border rounded-md text-sm" onClick={CadastrarCategoria}>
            Cadastrar Novo
          </button>
        </div>

        {/*Input de Pesquisa, faz o filtro das informações da tabela*/}
        <div className="flex flex-1 px-3 py-1">
          <Input className="w-full border h-9 rounded-md outline-none px-2 mb-1 bg-amber-50"
            placeholder="Pesquisar..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)} />
        </div>
      </div>

      {/* Inicio da Tabela*/}
      <div className="px-3">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          {/* Inicio do cabeçalho da Tabela */}
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 w-1/2 border">Descrição</th>
              <th className="px-4 py-2 border">Finalidade</th>
            </tr>
          </thead>
          {/* Fim do cabeçalho da tabela*/}

          {/* Inicio do corpo da tabela */}
          <tbody>
            {categoriaFiltradas.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-4 py-2 border text-center ">{categoria.id}</td>
                <td className="px-4 py-2 border">{categoria.descricao}</td>
                <td className="px-4 py-2 border text-center">{(categoria.finalidade == 1 ? "1 - Despesa" : " 2 - Receita" )}</td>

              </tr>
            ))}
          </tbody>
          {/* Fim do corpo da tabela*/}

        </table>
        {/* fim da tabela*/}
      </div>
    </div>
  )
}
