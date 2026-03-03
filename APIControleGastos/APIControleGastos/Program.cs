using APIControleGastos.Context;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

//Adicionado para evitar ciclos na geração do Json
builder.Services.AddControllers().AddJsonOptions(options =>
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Adiciona permissão para as requisições do front-end
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            //adicionado para receber todas as requisições sem gerar token de acesso
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

//Definição da String de Conexão para o BD
var mySQLConnection = builder.Configuration.GetConnectionString("DefaultConnection");

//Contexto do BD para uso na aplicação
builder.Services.AddDbContext<ControleGastosDbContext>(options =>
    options.UseMySql(mySQLConnection, ServerVersion.AutoDetect(mySQLConnection)));

var app = builder.Build();

// Swagger 
if (app.Environment.IsDevelopment())
{
    //Gerar a documentação interativa da API ao rodar o projeto
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactPolicy");
app.UseAuthorization();
app.MapControllers();
app.Run();
