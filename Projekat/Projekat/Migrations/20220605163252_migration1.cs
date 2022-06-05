using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projekat.Migrations
{
    public partial class migration1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SavedModels",
                table: "SavedModels");

            migrationBuilder.AlterColumn<string>(
                name: "ModelName",
                table: "SavedModels",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SavedModels",
                table: "SavedModels",
                columns: new[] { "UserID", "ModelID", "ModelName" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SavedModels",
                table: "SavedModels");

            migrationBuilder.AlterColumn<string>(
                name: "ModelName",
                table: "SavedModels",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SavedModels",
                table: "SavedModels",
                columns: new[] { "UserID", "ModelID", "DateSaved" });
        }
    }
}
