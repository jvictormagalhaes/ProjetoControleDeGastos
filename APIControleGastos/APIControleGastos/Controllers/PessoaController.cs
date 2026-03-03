using APIControleGastos.Context;
using APIControleGastos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIControleGastos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PessoaController : ControllerBase
    {
        //Instância do DBContext
        private readonly ControleGastosDbContext _context;

        public PessoaController(ControleGastosDbContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Pessoa>> RetornarTodos() //Retornar todos os registros de pessoa
        {
            try
            {
                var pessoas = _context.Pessoa.Where(x => x.Deletado == false).AsNoTracking().ToList();

                if(pessoas is null)
                {
                    return NotFound("Nenhum registro encontrado.");
                }

                return pessoas;

            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpGet("{id:int}", Name="ObterPessoa")] //Retornar pessoa por ID
        public ActionResult<Pessoa> RetornarPorId(int id)
        {
            try
            {
                
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }

            var pessoa = _context.Pessoa.AsNoTracking().FirstOrDefault(x => x.Id == id);

            if (pessoa is null)
            {
                return NotFound("Nenhum registro encontrado.");
            }

            return pessoa;
        }

        [HttpPost] 
        public ActionResult AdicionarPessoa(Pessoa pessoa) //Criar nova pessoa
        {
            try
            {
                if (pessoa == null)
                {
                    return BadRequest();
                }

                _context.Pessoa.Add(pessoa);
                _context.SaveChanges();

                return new CreatedAtRouteResult("ObterPessoa", new { id = pessoa.Id }, pessoa);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }            
        }

        [HttpPut("{id:int}")]
        public ActionResult AtualizarPessoa(int id, Pessoa pessoa) //Edição de pessoa
        {
            try
            {
                if (id != pessoa.Id)
                {
                    return BadRequest();
                }

                _context.Entry(pessoa).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(pessoa);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeletarPessoa(int id) //Deleção de Pessoa
        {
            try
            {
                var pessoa = _context.Pessoa.FirstOrDefault(x => x.Id == id);

                if (pessoa is null)
                {
                    return NotFound("Registro não encontrado.");
                }

                //Deleção Lógica para que não perca a informação completamente
                pessoa.Deletado = true;
                _context.SaveChanges();

                return Ok(pessoa);
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }
    }
}
