using Microsoft.EntityFrameworkCore;
using MoveIt.DataAccess.IRepositories;
using MoveIT.Domain.DBContext;
using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.DataAccess.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(MoveITContext context) : base(context)
        {
        }
        public virtual async Task<IEnumerable<User>> GetAll()
        {
            return await dbSet.Include(u => u.Trips).ThenInclude(t => t.Points).ToListAsync();
        }
        public virtual async Task<User?> GetByEmail(string email)
        {
            var EntityToReturn = await dbSet.FirstOrDefaultAsync(user => user.Email == email);
            if (EntityToReturn == null) return null;
            return EntityToReturn;
        }

        public virtual async Task<User> GetById(string id)
        {
            var user = await dbSet.Include(x => x.Trips).ThenInclude(t => t.Points).FirstOrDefaultAsync(user => user.Id == id);
            if (user == null) throw new KeyNotFoundException("ID not found");
            return user;
        }
    }
}
