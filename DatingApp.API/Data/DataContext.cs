using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>,
        UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        // bellow tables are added to MSSQL DB by EntityFramework Core using Migration
        // initial table creation adding Values Table
        public DbSet<Value> Values { get; set; }
        
        // adding Users Table
        // public DbSet<User> Users { get; set; } (IdentityDbContext will takecare)

        // adding Photos table
        public DbSet<Photo> Photos { get; set; }

        public DbSet<Like> Likes { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole => {
                // creating user role with the combination of roleid and userid
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role).WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId).IsRequired();

                userRole.HasOne(ur => ur.User).WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId).IsRequired();

            });


            modelBuilder.Entity<Like>().HasKey(k => new { k.LikerId, k.LikeeId });

            modelBuilder.Entity<Like>().HasOne(u => u.Likee).WithMany(u => u.Likers)
                .HasForeignKey(u => u.LikeeId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>().HasOne(u => u.Liker).WithMany(u => u.Likees)
                .HasForeignKey(u => u.LikerId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>().HasOne(u => u.Sender).WithMany(m => m.MessagesSent).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>().HasOne(u => u.Recipient).WithMany(m => m.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
        }

    }
}
