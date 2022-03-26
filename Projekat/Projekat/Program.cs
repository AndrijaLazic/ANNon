using Microsoft.AspNetCore.Builder;
using Projekat.Clients;
using Projekat.Data;
using Projekat.Modeli;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient<MachineLearningClient>();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//BAZA mySql
var KonekcioniStringZaMySql = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MySqlDbContext>(options =>
{
    options.UseMySql(KonekcioniStringZaMySql, ServerVersion.AutoDetect(KonekcioniStringZaMySql));
});
//

// Enable CORS
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseWebSockets();
app.UseRouting();

app.MapControllers();

app.Run();
