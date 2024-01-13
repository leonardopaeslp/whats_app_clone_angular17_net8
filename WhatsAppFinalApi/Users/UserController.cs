using Microsoft.AspNetCore.Mvc;

namespace WhatsAppFinalApi.Users
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController: ControllerBase
    {
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(UserFakeDb.Users);    
        }

        [HttpPut(template: "{userId}/image")]
        public async Task<IActionResult> UpdateImage(Guid userId, [FromForm] IFormFile file)
        {
            var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var userImage = UserFakeDb.userImages.FirstOrDefault(userImage => userImage.UserId == userId);
            if(userImage == null)
            {
                UserFakeDb.userImages.Add(item: new UserImage(userId, memoryStream.ToArray()));
            } else
            {   

                userImage.UpdateImage(memoryStream.ToArray());
            }

            return Ok();
        }

        [HttpGet(template: "{userId}/image")]
        public IActionResult GetUserImage(Guid userId)
        {
            var userImage = UserFakeDb.userImages.FirstOrDefault(user => user.UserId == userId);

            if(userImage == null) return NotFound();

            return File(userImage.Image, contentType: "image/png");
        }
    }
}
