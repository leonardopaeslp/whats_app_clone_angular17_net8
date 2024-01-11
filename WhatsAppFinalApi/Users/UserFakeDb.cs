namespace WhatsAppFinalApi.Users
{
    public static class UserFakeDb
    {
        public static readonly List<User> Users = [
            new User(id:new Guid(g: "4d25ddc0-7bfa-4964-9bcb-90fe8c6c9c3e"),name: "Leonardo Paes"),
            new User(id: new Guid(g: "87c83c8c-7c74-444d-9f10-841083e7e482"), name: "nome 1"),
            new User(id: new Guid(g: "3aec56ad-b74d-469c-91fd-e21f6de5548b"), name: "nome 2"),
            new User(id: new Guid(g: "67cb4c8a-4dce-4f36-bb59-5db371e239a4"), name: "nome 3"),
            new User(id: new Guid(g: "915652e3-581e-4b19-bdc2-c905bf2ee2ca"), name: "nome 4")
        ];
    }
}
