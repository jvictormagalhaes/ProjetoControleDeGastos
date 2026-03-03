import { Link } from 'react-router-dom'

//componente para se perpetuar por todas as páginas.

export function Header() {
  return (
    <header className="w-full bg-gray-800 shadow-md">

      {/* Inicio da navegação no cabeçalho */}
      <nav className="max-w-7xl mx-auto h-14 flex items-center justify-between px-2">

        {/*Logo Sistema*/}
        <h1 className="mt-6 text-white mb-6 font-bold text-1xl">Controle de
          <span className="bg-linear-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">&nbsp;Gastos</span> {/* nbsp é um espaço em branco*/}
        </h1>

        {/* Inicio do menu de navegação */}
        <ul className="flex items-center gap-6 text-gray-200 w-2/3 font-medium">
          <li>
            {/* navegação para home */}
            <Link to="/" className="hover:text-white hover:border-b-2 border-blue-400 pb-1 transition">
              Home
            </Link>
          </li>

          {/* navegação para CRUD de pessoas */}
          <li>
            <Link to="/pessoa" className="hover:text-white hover:border-b-2 border-blue-400 pb-1 transition">
              Pessoas
            </Link>
          </li>

          {/* navegação de categoria (cadastro/consulta) */}
          <li className="relative group">
            <label className="cursor-pointer hover:text-white pb-1 transition hover:border-b-2 border-blue-400">Categoria</label>
            <ul className="absolute left-0 top-full hidden group-hover:block bg-gray-700 rounded-md shadow-lg w-max">
              {/* navegação para cadastro de categoria */}
              <li>
                <Link to="/categoria" className="block px-4 py-2 hover:bg-gray-600">
                  <span className="hover:border-b-2 border-blue-400">Cadastro</span>
                </Link>
              </li>
              {/* navegação para consulta de totais de categoria */}
              <li>
                <Link to="/categoria-consulta" className="block px-4 py-2 hover:bg-gray-600">
                  <span className="hover:border-b-2 border-blue-400">Consulta</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* navegação de transações (cadastro/consulta) */}
          <li className="relative group">
            <label className="cursor-pointer hover:text-white pb-1 transition hover:border-b-2 border-blue-400">Transações</label>
            <ul className="absolute left-0 top-full hidden group-hover:block bg-gray-700 rounded-md shadow-lg w-max">
              <li>
                {/* navegação para cadastro de categoria */}
                <Link to="/transacao" className="block px-4 py-2 hover:bg-gray-600">
                  <span className="hover:border-b-2 border-blue-400">Cadastro</span>
                </Link>
              </li>
              {/* navegação para consulta de totais de categoria */}
              <li>
                <Link to="/transacao-consulta" className="block px-4 py-2 hover:bg-gray-600">
                  <span className="hover:border-b-2 border-blue-400">Consulta</span>
                </Link>
              </li>
            </ul>
          </li>

        </ul>
      </nav>
      {/* Fim da navegação de cabeçalho */}
    </header>
  )
}