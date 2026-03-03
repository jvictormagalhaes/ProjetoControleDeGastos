using APIControleGastos.Models;
using Microsoft.EntityFrameworkCore;

namespace APIControleGastos.Context;

public class ControleGastosDbContext : DbContext
{
    //Construtor DBContext para injeção de depedência
    public ControleGastosDbContext(DbContextOptions<ControleGastosDbContext> options) : base(options)
    {
        
    }

    //Entidades do BD
    public DbSet<Pessoa> Pessoa { get; set; }
    public DbSet<Categoria> Categoria { get; set; }
    public DbSet<Transacao> Transacao { get; set; }
}
