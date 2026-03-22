using Pacifickode_Practicaltest.Data;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<DepartmentRepository>();
builder.Services.AddScoped<EmployeeRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();    // ← must build FIRST before checking connection

// ── Database connection check on startup ──
var connectionString = app.Configuration.GetConnectionString("DefaultConnection");
try
{
    using var connection = new SqlConnection(connectionString);
    connection.Open();
    Console.WriteLine("✅ Database connected successfully.");
    Console.WriteLine($"   Server   : {connection.DataSource}");
    Console.WriteLine($"   Database : {connection.Database}");
}
catch (Exception ex)
{
    Console.WriteLine("❌ Database connection FAILED.");
    Console.WriteLine($"   Error: {ex.Message}");
}
// ── End of check ──

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

app.Run();