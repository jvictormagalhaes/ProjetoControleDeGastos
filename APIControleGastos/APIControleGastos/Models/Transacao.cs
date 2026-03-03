using APIControleGastos.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace APIControleGastos.Models;

public class Transacao
{
    [Key]
    public int Id { get; set; }

    [StringLength(400)]
    public string? Descricao { get; set; }

    [Required]
    [Column(TypeName="decimal(10,2)")]
    [Range(0 , double.MaxValue)]
    public decimal Valor { get; set; }

    [Required]
    public FinalidadeEnum Tipo { get; set; }

    public int PessoaId { get; set; }

    public Pessoa? Pessoa { get; set; }

    public int CategoriaId { get; set; }

    public Categoria? Categoria { get; set; }
}
