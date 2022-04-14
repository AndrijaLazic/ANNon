using Microsoft.AspNetCore.Builder;
using Projekat.Clients;
using Projekat.Data;
using Projekat.Modeli;
using Projekat.SignalRCommunication.Hubs;
using WebSocketSharp.Server;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient<MachineLearningClient>();



// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//konfigurisanje SignalR
builder.Services.AddSignalR();

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
    options.AddPolicy("CorsPolicy",
        builder =>
        {
            builder.WithOrigins("http://147.91.204.115:10000/", "http://147.91.204.115:10000", "http://147.91.204.115:10002/", "http://147.91.204.115:10002")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
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
app.UseRouting();
app.UseAuthorization();
app.UseCors("CorsPolicy");


app.UseEndpoints(endpoints => {
    app.MapControllers();
    endpoints.MapHub<EpochHub>("/hub");
});

app.Run();
