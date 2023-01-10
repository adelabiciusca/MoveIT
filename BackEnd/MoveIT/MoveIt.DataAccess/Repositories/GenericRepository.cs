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
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseModel
    {
        protected MoveITContext _context;
        protected DbSet<T> dbSet;

        public GenericRepository(MoveITContext context)
        {
            _context = context;
            this.dbSet = context.Set<T>();
        }
        public virtual async Task<IEnumerable<T>> GetAll()
        {
            return await dbSet.ToListAsync();
        }
        public virtual async Task<T> GetById(string id)
        {
            var EntityToReturn = await dbSet.FindAsync(id);
            if (EntityToReturn == null) throw new KeyNotFoundException("ID not found");
            return EntityToReturn;
        }
        public virtual async Task<T> Create(T entity)
        {
            entity.Id = Guid.NewGuid().ToString();
            await dbSet.AddAsync(entity);
            return entity;
        }
        public virtual Task<T> Update(T entity)
        {
            dbSet.Update(entity);
            return Task.FromResult(entity);
        }
        public async Task<bool> DeleteById(string id)
        {
            var entity = await dbSet.FindAsync(id);
            if (entity == null) throw new KeyNotFoundException();
            dbSet.Remove(entity);
            return true;
        }
    }
}
