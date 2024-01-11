using Microsoft.AspNetCore.Mvc;

namespace WhatsAppFinalApi.Users
{
    [ApiController]
    [Route("[controller]")]
    public class UserController: ControllerBase
    {
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(UserFakeDb.Users);    
        }
    }
}
