namespace APIControleGastos.Models;

public class Total //Model criado para gerar o calculo dos totais de categoria e pessoa.
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string descricaoCategoria { get; set; }
    public decimal Receita { get; set; }
    public decimal Despesa { get; set; }
    public Pessoa? Pessoa { get; set; }
    public Categoria? Categoria { get; set; }
}
