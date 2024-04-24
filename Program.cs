using Microsoft.AspNetCore.Authentication;
using Microsoft.OpenApi.Models;
using Stock_Exchange.Hubs;

var builder = WebApplication.CreateBuilder(args);

//public IConfiguration Configuration { get; }

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name:"Frontend",
        policy =>
        {
            policy.AllowAnyHeader()
                       .AllowAnyMethod()
                       .SetIsOriginAllowed(_ => true)
                       .AllowCredentials();
            //policy.WithOrigins("http://localhost:44422") // replace this port if you need with the origin of your Angular app
            //       .AllowAnyHeader()
            //       .AllowAnyMethod()
            //       .WithExposedHeaders("Access-Control-Allow-Origin");
        });
});

builder.Services.AddSwaggerGen(c =>
{
    c.AddServer(new OpenApiServer
    {
        Description = "Assesment Server",
        Url = "http://localhost:7272"
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "APIKey";
    options.DefaultChallengeScheme = "APIKey";
}).AddScheme<AuthenticationSchemeOptions, Stock_Exchange.Authorization.APIKey>("APIKey", null);

var app = builder.Build();

app.UseSwagger().UseSwaggerUI();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}



app.UseStaticFiles();

app.UseCors("Frontend"); // to enable CORS

app.UseRouting();
app.UseAuthentication(); 
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapHub<StockUpdates>("/priceUpdateHub");
app.MapFallbackToFile("index.html"); ;

app.Run();
