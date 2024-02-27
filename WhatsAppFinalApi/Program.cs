using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WhatsAppFinalApi.Auth;

namespace WhatsAppFinalApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(["http://localhost:4200"]);
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
                policy.AllowCredentials();
                policy.SetIsOriginAllowed(_ => true);

            }));

            builder.Services.AddAuthentication(opt =>
            {
                opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(option =>
            {
                var secretByte = Encoding.UTF8.GetBytes(AuthSettings.JwtSecret);
                var secretKey = new SymmetricSecurityKey(secretByte);

                option.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                    ValidateIssuer = false,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = secretKey
                };
            });

            builder.Services.Configure<JwtSettingsOpptions>(
                builder.Configuration.GetRequiredSection(JwtSettingsOpptions.SessionName));

            //provider é um objeto que representa o container de injeção de dependência do .NET.
            //É ele quem configura tudo e retorna as instâncias das injeções de dependência.
            //Estou criando uma injeção de dependência.
            builder.Services.AddSingleton(provider => provider.GetRequiredService<IOptions<JwtSettingsOpptions>>().Value);
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors();

            //app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}