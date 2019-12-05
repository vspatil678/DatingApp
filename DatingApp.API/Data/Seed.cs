using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            if(!userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeed.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                // create some roles

                var roles = new List<Role>
                {
                    new Role() {Name = "Admin"},
                    new Role() {Name = "Member"},
                    new Role() {Name = "Employee"},
                    new Role() {Name = "Moderator"},
                    new Role() {Name = "VIP"},
                };

                foreach (var role in roles)
                {
                    roleManager.CreateAsync(role).Wait();
                }
                foreach (var user in users)
                {
                    user.Photos.SingleOrDefault().IsApproved = true;
                  userManager.CreateAsync(user, "password").Wait();
                  userManager.AddToRoleAsync(user, "Member");
                }

                // create admin user

                var adminUser = new User { UserName = "VINODA", Gender = "Male" };
                var result = userManager.CreateAsync(adminUser, "VINODA").Result;
                if(result.Succeeded)
                {
                    var admin = userManager.FindByNameAsync("VINODA").Result;
                    userManager.AddToRolesAsync(admin, new[] { "Admin", "Member", "Moderator" });
                }
            }
        }

        private  static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}
