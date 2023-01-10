using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.DataAccess.IRepositories
{
    public interface IGenericRepository<T>
    {
        Task<IEnumerable<T>> GetAll();
        Task<T> GetById(string id);
        Task<T> Create(T entity);
        Task<T> Update(T entity);
        Task<bool> DeleteById(string id);
    }
}
