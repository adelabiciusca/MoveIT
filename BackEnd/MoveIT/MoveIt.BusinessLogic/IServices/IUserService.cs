using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.BusinessLogic.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAll();
        Task<User> GetById(string id);
        Task<UserDto> Register(string name, string mail, string password);
        Task<UserDto> Login(string mail, string password);
        Task<User> Update(User user);
        Task<bool> Delete(string id);
        Task<List<Trip>> GetAllTrips(string userId);
    }
}
