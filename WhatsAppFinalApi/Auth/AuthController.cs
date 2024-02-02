using Microsoft.AspNetCore.Mvc;
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
        public IActionResult Login(AuthLoginRequest request)
        {
            if(!UserFakeDb.Users.Any(user => user.Id == request.UserId))
            {
                return NotFound("User não encontrado");
            }

            var byteSecret = Encoding.UTF8.GetBytes(AuthSettings.JwtSecret).ToArray();

            var secretKey = new SigningCredentials(new SymmetricSecurityKey(byteSecret), SecurityAlgorithms.HmacSha256);

            var userIdClaim = new Claim(ClaimTypes.NameIdentifier, request.UserId.ToString().ToUpperInvariant());

            var securityToken = new JwtSecurityToken(signingCredentials: secretKey, claims: [userIdClaim]);

            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return Ok(new {request.UserId, token});
        }
    }
}
