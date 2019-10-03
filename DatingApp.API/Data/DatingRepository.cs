using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dataContext;
        public DatingRepository(DataContext dataContext)
        {
            this._dataContext = dataContext;
        }
        public void Add<T>(T entity) where T : class
        {
            this._dataContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this._dataContext.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var mainPhoto = await this._dataContext.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
            return mainPhoto;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _dataContext.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await this._dataContext.Users.Include(s => s.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await this._dataContext.Users.Include(s => s.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await this._dataContext.SaveChangesAsync() > 0;
        }
    }
}
