using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APIControleGastos.Migrations
{
    /// <inheritdoc />
    public partial class AdicionadoColunaDeletadoPessoaModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Deletado",
                table: "Pessoa",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deletado",
                table: "Pessoa");
        }
    }
}
