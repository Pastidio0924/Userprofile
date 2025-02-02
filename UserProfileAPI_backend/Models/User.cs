using System.ComponentModel.DataAnnotations;

namespace UserProfileAPI.Models;
public class User
{
    public int Id { get; set; }
    [Required]
    public string? Username { get; set; }
    [Required]
    public string? Email { get; set; }
    public string? Bio { get; set; }
    public User()
    {
        CreatedAt = DateTime.UtcNow;  //Always initialize to UTC
    }

    //No Setter needed for CreatedAt anymore
    public DateTime CreatedAt {get; set;}
}