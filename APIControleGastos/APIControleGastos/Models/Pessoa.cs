using System.ComponentModel.DataAnnotations;

namespace APIControleGastos.Models;

public class Pessoa
{
    [Key]
    public int Id { get; set; }

    [StringLength(200)]
    [Required]
    public string Nome { get; set; }

    [Required]
    public int Idade { get; set; }
    public Boolean Deletado { get; set; }
}
