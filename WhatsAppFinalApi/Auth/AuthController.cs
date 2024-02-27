using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WhatsAppFinalApi.Users;

namespace WhatsAppFinalApi.Auth
{
    [ApiController, Route("api/[controller]")]
    public class AuthController: ControllerBase
    {
        [HttpPost]
        public IActionResult Login(AuthLoginRequest request, [FromServices] JwtSettingsOpptions jwtSettings)
        {
            if(!UserFakeDb.Users.Any(user => user.Id == request.UserId))
            {
                return NotFound("User não encontrado");
            }

            //É dentro de .Value que fica a instância da classe JwtSettingsOpptions
            //Quando eu pedir o JwtSettingsOpptions quero que você me dê a
            //injeção de dependência jwtSettings já com o .Value

            var secretTest = jwtSettings.Secret;

            var byteSecret = Encoding.UTF8.GetBytes(secretTest!);

            var secretKey = new SigningCredentials(new SymmetricSecurityKey(byteSecret), SecurityAlgorithms.HmacSha256);

            var userIdClaim = new Claim(ClaimTypes.NameIdentifier, request.UserId.ToString().ToUpperInvariant());

            var securityToken = new JwtSecurityToken(signingCredentials: secretKey, claims: [userIdClaim]);

            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return Ok(new {request.UserId, token});
        }
    }
}
