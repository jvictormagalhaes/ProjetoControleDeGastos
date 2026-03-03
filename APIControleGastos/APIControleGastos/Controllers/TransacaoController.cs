using APIControleGastos.Context;
using APIControleGastos.Enums;
using APIControleGastos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APIControleGastos.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TransacaoController : ControllerBase
    {
        //Instância do DBContext
        private readonly ControleGastosDbContext _context;

        public TransacaoController(ControleGastosDbContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Transacao>> RetornarTodos() //Retornar todos os registros de transacao
        {
            try
            {
                var transacaos = _context.Transacao
                                        .AsNoTracking()
                                        .Include(x => x.Pessoa)
                                        .Include(x => x.Categoria)
                                        .Where(x => x.Pessoa.Deletado == false) //retira as pessoas que foram deletadas
                                        .ToList();

                if (transacaos is null)
                {
                    return NotFound("Nenhum registro encontrado.");
                }

                return transacaos;

            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpGet("{id:int}", Name = "ObterTransacao")] //Retornar transacao por ID
        public ActionResult<Transacao> RetornarPorId(int id)
        {
            try
            {
                var transacao = _context.Transacao.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if (transacao is null)
                {
                    return NotFound("Nenhum registro encontrado.");
                }

                return transacao;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
            
        }

        [HttpGet("totais-pessoa")]
        public ActionResult<IEnumerable<Total>> RetornarTotaisPorPessoa() //Retorna os totais de cada pessoa
        {
            try
            {
                var transacao = _context.Transacao.AsNoTracking()
                                         .Where(x => x.Pessoa.Deletado == false) //Retira as pessoas deletadas para não somar o valor
                                         .Include(x => x.Pessoa) //inclui pessoa
                                         .GroupBy(x => x.PessoaId) //agrupa por ID de pessoa
                                         .Select(x => new Total
                                         {
                                             Id = x.Key,
                                             Nome = x.FirstOrDefault().Pessoa.Nome,
                                             Receita = x.Where(x => x.Tipo != FinalidadeEnum.Despesa).Sum(x => x.Valor), //Todos os valores que não seja despesa.
                                             Despesa = x.Where(x => x.Tipo != FinalidadeEnum.Receita).Sum(x => x.Valor) //Todos os valores que não seja receita.
                                         })
                                         .ToList();

                return transacao;
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpGet("totais-categoria")]
        public ActionResult<IEnumerable<Total>> RetornarTotaisPorCategoria() //Retorna todos os totais de categoria
        {
            try
            {
                var transacao = _context.Transacao.Where(x => x.Pessoa.Deletado == false) //Retira as pessoas deletadas para não somar o valor
                                         .Include(x => x.Categoria) //inclui categoria
                                         .GroupBy(x => x.CategoriaId) //agrupa por ID de categoria
                                         .Select(x => new Total
                                         {
                                             Id = x.Key,
                                             descricaoCategoria = x.FirstOrDefault().Categoria.Descricao,
                                             Receita = x.Where(x => x.Tipo != FinalidadeEnum.Despesa).Sum(x => x.Valor), //Todos os valores que não seja despesa.
                                             Despesa = x.Where(x => x.Tipo != FinalidadeEnum.Receita).Sum(x => x.Valor) //Todos os valores que não seja receita.
                                         })
                                         .ToList();

                return transacao;
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpPost] //Criar nova transacao
        public ActionResult AdicionarTransacao(Transacao transacao)
        {
            try
            {
                if (transacao == null)
                {
                    return BadRequest();
                }

                //verificação para menores de 18 não poderem adicionar uma transação
                if (transacao.Pessoa?.Idade < 18 && transacao.Tipo == FinalidadeEnum.Receita)
                {
                    return BadRequest("Menor de idade não pode ter receita.");
                }

                _context.Transacao.Add(transacao);
                _context.SaveChanges();

                return new CreatedAtRouteResult("ObterTransacao", new { id = transacao.Id }, transacao);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        //Deleção e Edição criados, mas não utilizados
        #region Actions não utilizados.
        [HttpPut("{id:int}")]
        public ActionResult AtualizarTransacao(int id, Transacao transacao) //Atualização de Transação
        {
            try
            {
                if (id != transacao.Id)
                {
                    return BadRequest();
                }

                _context.Entry(transacao).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(transacao);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeletarTransacao(int id) //Deleção de Transação
        {
            try
            {
                var transacao = _context.Transacao.FirstOrDefault(x => x.Id == id);

                if (transacao is null)
                {
                    return NotFound("Registro não encontrado.");
                }

                _context.Remove(transacao);
                _context.SaveChanges();

                return Ok(transacao);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Ocorreu um problema ao tratar a sua solicitação.");
            }
        }
        #endregion
    }
}
