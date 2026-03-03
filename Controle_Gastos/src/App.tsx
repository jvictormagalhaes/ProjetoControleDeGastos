import { createBrowserRouter } from "react-router-dom";

import { Home } from './pages/home';
import { Pessoa } from './pages/pessoa';
import { PessoaCadastrar } from './pages/pessoa-cadastrar';
import { PessoaEditar } from './pages/pessoa-editar';
import { Categoria } from "./pages/categoria";
import { CategoriaCadastrar } from "./pages/categoria-cadastrar";
import { CategoriaConsulta } from "./pages/categoria-consulta";
import { Transacao } from './pages/transacao';
import { TransacaoCadastrar } from './pages/transacao-cadastrar';
import { TransacaoConsulta } from './pages/transacao-consulta';
import { NotFound } from './pages/notfound';

import { Layout } from './pages/componentes/Layout'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children:[
          {
        path: '/',
        element: <Home/>
      },
      {
        path: '/pessoa',
        element: <Pessoa/>
      },
      {
        path: '/pessoa-cadastrar',
        element: <PessoaCadastrar/>
      },
      {
        path: '/pessoa-editar/:id',
        element: <PessoaEditar/>
      },
      {
        path: '/categoria',
        element: <Categoria/>
      },
      {
        path: '/categoria-cadastrar',
        element: <CategoriaCadastrar/>
      },
      {
        path: '/categoria-consulta',
        element: <CategoriaConsulta/>
      },
      {
        path: '/transacao',
        element: <Transacao/>
      },
      {
        path: '/transacao-cadastrar',
        element: <TransacaoCadastrar/>
      },
      {
        path: '/transacao-consulta',
        element: <TransacaoConsulta/>
      }
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
])

export { router };
