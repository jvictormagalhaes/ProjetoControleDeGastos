import { useEffect, useState } from "react"

import { api } from '../../services/api'

interface TotalTransacaoProps {
    id: number;
    nome: string;
    despesa: number;
    receita: number;
}

export function TransacaoConsulta() {

    const [consultaTransacao, setConsultaTransacao] = useState<TotalTransacaoProps[]>([]);

    //Requisição para trazer os valores totais das transações da API
    useEffect(() => {
        async function RetornarConsulta() {
            const response = await api.get("/Transacao/totais-pessoa");
            setConsultaTransacao(response.data)
        }

        RetornarConsulta();
    }, [])

    //Função para formatar o valor em real. exemplo: (R$ 0,00)
    function FormatarValor(valor: number) {

        const valorFormatado = Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        return valorFormatado.format(valor);
    }

    //Função para calcular o total de receitas
    function TotalReceita() {
        const valor = consultaTransacao.reduce((total, item) => total + item.receita, 0);
        return valor;
    }

    //Função para calcular o total de despesas
    function TotalDespesa() {
        const valor = consultaTransacao.reduce((total, item) => total + item.despesa, 0);
        return valor;
    }

    //Função para calcular o total do saldo líquido
    function SaldoLiquido() {
        const valorReceita = consultaTransacao.reduce((total, item) => total + item.receita, 0);
        const valorDespesa = consultaTransacao.reduce((total, item) => total + item.despesa, 0);

        return(valorReceita - valorDespesa);
    }

    return (
        <div className="flex flex-col">
            {/* titulo da página */}
            <div>
                <h1 className="text-white text-3xl font-bold px-3 mb-3 border-b border-gray-600 pb-2">Consulta de Transações</h1>
            </div>

            <div className="px-3 border-b">
                {/* Inicio da tabela */}
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                     {/* Inicio cabeçalho da Tabela */}
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 w-1/2 border">Nome</th>
                            <th className="px-4 py-2 border">Receita</th>
                            <th className="px-4 py-2 border">Despesa</th>
                            <th className="px-4 py-2 border">Saldo</th>
                        </tr>
                    </thead>
                    {/* Fim do cabeçalho da Tabela*/}

                    {/* Inicio do Corpo da tabela */}
                    <tbody>
                        {consultaTransacao.map((consulta) => (
                            <tr key={consulta.id} className="hover:bg-gray-100 transition-colors">
                                <td className="px-4 py-2 border text-center ">{consulta.id}</td>
                                <td className="px-4 py-2 border">{consulta.nome}</td>
                                <td className="px-4 py-2 border">{FormatarValor(consulta.receita)}</td>
                                <td className="px-4 py-2 border">{FormatarValor(consulta.despesa)}</td>
                                <td className="px-4 py-2 border">{FormatarValor(consulta.receita - consulta.despesa)}</td>
                            </tr>
                        ))}
                    </tbody>
                     {/* Fim do Corpo da tabela */}
                </table>
                {/* Fim da tabela */}
            </div>
            
            {/* Inicio de labels com Valores Totais (Receita, Despesa e Saldo Líquido) */}
            <div className="flex flex-row justify-end px-2 py-1">
                <label className="border-white bg-gray-700 text-white px-4 py-2 rounded-l-md font-bold">Total Receita:</label>
                <label className="border mr-2 px-4 py-2 rounded-r-md">{FormatarValor(TotalReceita())}</label>
                <label className="border-white bg-gray-700 text-white px-4 py-2 rounded-l-md font-bold">Total Despesas:</label>
                <label className="border mr-2 px-4 py-2 rounded-r-md">{FormatarValor(TotalDespesa())}</label>
                <label className="border-white bg-gray-700 text-white px-4 py-2 rounded-l-md font-bold">Saldo Líquido:</label>
                <label className="border mr-2 px-4 py-2 rounded-r-md">{FormatarValor(SaldoLiquido())}</label>
            </div>
            {/* Fim de labels com Valores Totais (Receita, Despesa e Saldo Líquido) */}
        </div>
    )
}
