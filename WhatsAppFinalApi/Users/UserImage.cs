namespace WhatsAppFinalApi.Users
{
    public class UserImage(Guid userId, byte[] image)
    {
        public Guid UserId { get; set; } = userId;
        public byte[] Image { get; set; } = image;

        public void UpdateImage(byte[] newImage)
        {
            Image = newImage;
        }
    }
}
