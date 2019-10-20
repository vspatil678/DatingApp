using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        // bellow tables are added to MSSQL DB by EntityFramework Core using Migration
        // initial table creation adding Values Table
        public DbSet<Value> Values { get; set; }
        
        // adding Users Table
        public DbSet<User> Users { get; set; }

        // adding Photos table
        public DbSet<Photo> Photos { get; set; }

        public DbSet<Like> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Like>().HasKey(k => new { k.LikerId, k.LikeeId });

            modelBuilder.Entity<Like>().HasOne(u => u.Likee).WithMany(u => u.Likers)
                .HasForeignKey(u => u.LikeeId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Like>().HasOne(u => u.Liker).WithMany(u => u.Likees)
                .HasForeignKey(u => u.LikerId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
