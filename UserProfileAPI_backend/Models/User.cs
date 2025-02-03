using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UserProfileAPI.Models;
public class User
{
    public int Id { get; set; }
    [Required]
    public string? Username { get; set; }
    [Required]
    public string? Email { get; set; }
    public string? Gender { get; set; }
    public DateTime? BirthDate { get; set; }
    [NotMapped]
    public int? Age
    {
        get        {
            if (BirthDate.HasValue) {
                DateTime today = DateTime.Today;
                int age = today.Year - BirthDate.Value.Year;
                if (BirthDate > today.AddYears(-age)) age--;
                return age;
            }
            return null;
        }
    }
    public User()
    {
        CreatedAt = DateTime.UtcNow;  //Always initialize to UTC
    }

    //No Setter needed for CreatedAt anymore
    public DateTime CreatedAt {get; set;}
}