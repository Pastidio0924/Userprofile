using UserProfileAPI.Models;
using UserProfileAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization; // For enum serialization

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSqlConnection")));

// Add services to the container.
builder.Services.AddControllers();
/*                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); // Handles enum to string
                    options.JsonSerializerOptions.PropertyNamingPolicy = null;  // No camelCase
                });*/

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", builder =>
        builder.WithOrigins("http://localhost:3000") // Your React app's URL
               .AllowAnyMethod()
               .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger UI
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowMyOrigin"); // Important: UseCors must be before UseAuthorization

app.UseAuthorization();

app.MapControllers();

app.Run();
