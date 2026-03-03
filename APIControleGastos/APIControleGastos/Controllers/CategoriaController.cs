using APIControleGastos.Context;
using APIControleGastos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIControleGastos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        //Instância do DBContext
        private readonly ControleGastosDbContext _context;

        public CategoriaController(ControleGastosDbContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Categoria>> RetornarTodos() //Retornar todos os registros de categoria
        {
            try
            {
                var categorias = _context.Categoria.AsNoTracking().ToList();

                if (categorias is null)
                {
                    return NotFound("Nenhum registro encontrado.");
                }

                return categorias;

            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpGet("{id:int}", Name = "ObterCategoria")] //Retornar categoria por ID
        public ActionResult<Categoria> RetornarPorId(int id)
        {
            try
            {
                var categoria = _context.Categoria.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if (categoria is null)
                {
                    return NotFound("Nenhum registro encontrado.");
                }

                return categoria;
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpPost] //Criar nova categoria
        public ActionResult AdicionarCategoria(Categoria categoria)
        {
            try
            {
                if (categoria == null)
                {
                    return BadRequest();
                }

                _context.Categoria.Add(categoria);
                _context.SaveChanges();

                return new CreatedAtRouteResult("ObterCategoria", new { id = categoria.Id }, categoria);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        //Deleção e Edição criados, mas não utilizados
        #region Actions não utilizados.
        [HttpPut("{id:int}")]
        public ActionResult AtualizarCategoria(int id, Categoria categoria) //Edição de categoria
        {
            try
            {
                if (id != categoria.Id)
                {
                    return BadRequest();
                }

                _context.Entry(categoria).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(categoria);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeletarCategoria(int id) //Deleção de categoria
        {
            try
            {
                var categoria = _context.Categoria.FirstOrDefault(x => x.Id == id);

                if (categoria is null)
                {
                    return NotFound("Registro não encontrado.");
                }

                _context.Remove(categoria);
                _context.SaveChanges();

                return Ok(categoria);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }
        #endregion
    }
}
