using Microsoft.EntityFrameworkCore;
using UserProfileAPI.Models;

namespace UserProfileAPI.Data;

public class UserDbContext : DbContext
{
    public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } // This represents the users table
}