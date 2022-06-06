using Microsoft.AspNetCore.Builder;
using Projekat.Clients;
using Projekat.Data;
using Projekat.Modeli;
using Projekat.SignalRCommunication.Hubs;
using WebSocketSharp.Server;
using Projekat.Ostalo;
using Projekat.Servisi;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient<MachineLearningClient>();

builder.Services.AddHostedService<BrisanjeFajlovaServis>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<MailPodesavanja>(builder.Configuration.GetSection(nameof(MailPodesavanja)));
builder.Services.AddTransient<IMailService, MailService>();
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
        builder1 =>
        {
            builder1.WithOrigins((string)builder.Configuration.GetValue<string>("ML_Server_Config:http")+ (string)builder.Configuration.GetValue<string>("ML_Server_Config:host") +":"+ (string)builder.Configuration.GetValue<string>("ML_Server_Config:port"),
                (string)builder.Configuration.GetValue<string>("Front_Server_Config:http") + (string)builder.Configuration.GetValue<string>("Front_Server_Config:host") + ":" + (string)builder.Configuration.GetValue<string>("Front_Server_Config:port"))
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

/*
 * za server
 * migracija pri pokretanju
 * */
using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<MySqlDbContext>();
    dataContext.Database.Migrate();
}

app.UseEndpoints(endpoints => {
    app.MapControllers();
    endpoints.MapHub<EpochHub>("/hub");
});

app.Run();


