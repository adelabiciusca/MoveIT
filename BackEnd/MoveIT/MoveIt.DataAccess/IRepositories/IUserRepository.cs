using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.DataAccess.IRepositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmail(string email);
    }
}
