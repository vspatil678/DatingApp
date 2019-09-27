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
    }
}
