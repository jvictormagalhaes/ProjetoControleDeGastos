import { Outlet } from 'react-router-dom'
import { Header } from '../header'

export function Layout(){
  return(
    <div className='flex flex-col'>
      <div>
        <Header/> {/*Cria o cabeça de navegação para todas as páginas */}
      </div>
      <div className='pt-2'>
        <Outlet/> {/*Layout para todas as páginas */}
      </div>
    </div>
  )
}



      