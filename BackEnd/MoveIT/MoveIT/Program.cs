using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using MoveIt.BusinessLogic.IServices;
using MoveIt.BusinessLogic.Services;
using MoveIt.DataAccess;
using MoveIT.Domain.DBContext;
using System.Security.Principal;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddCors(o => o.AddPolicy("CORSPolicy", builder =>
{
    builder.WithOrigins("localhost", "127.0.0.1", "localhost:8081")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials().Build();
}));
builder.Services.AddControllers();
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
builder.Services.AddDbContext<MoveITContext>(options =>
{
    options.UseSqlServer(connection);
});

// Add the Unit of work to the container

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITripService, TripService>();
builder.Services.AddScoped<IPointService, PointService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<UnitOfWork>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<TripService>();
builder.Services.AddScoped<PointService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("CORSPolicy");
//app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();

app.UseAuthorization();

app.UseAuthentication();

app.MapControllers();

app.Run();

