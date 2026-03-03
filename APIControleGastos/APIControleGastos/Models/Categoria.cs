using APIControleGastos.Enums;
using System.ComponentModel.DataAnnotations;

namespace APIControleGastos.Models;

public class Categoria
{
    [Key]
    public int Id { get; set; }

    [StringLength(400)]
    [Required]
    public string? Descricao { get; set; }

    [Required]
    public FinalidadeEnum Finalidade { get; set; }

}