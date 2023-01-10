using Azure.Core;
using BCrypt.Net;
using MoveIt.BusinessLogic.IServices;
using MoveIt.DataAccess;
using MoveIT.Domain.Models;
using System.Net;

namespace MoveIt.BusinessLogic.Services
{
    public class UserService : BaseService, IUserService
    {
        public UserService(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _unitOfWork.Users.GetAll();
        }

        public async  Task<User> GetById(string id)
        {
            return await _unitOfWork.Users.GetById(id);
        }

        public async Task<User> Update(User user)
        {
            var updatedUser = await _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
            return updatedUser;
        }

        public async Task<bool> Delete(string id)
        {
            await _unitOfWork.Users.DeleteById(id);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<UserDto> Register(string name, string email, string password)
        {
            var users = await _unitOfWork.Users.GetAll();
            User user = new User()
            {
                Name = name,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                isAdmin = false,
            };
            foreach(var u in users)
            {
                if(u.Email != null)
                {
                    if (u.Email.Equals(user.Email))
                    {
                        return new UserDto() { error = "User with this email already exists!" };

                    }
                }
            }
            await _unitOfWork.Users.Create(user);
            await _unitOfWork.CompleteAsync();
            var response = new UserDto()
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                isAdmin = user.isAdmin,
            };
            return response;
        }

        public async Task<UserDto> Login(string email, string password)
        {
            var user = await _unitOfWork.Users.GetByEmail(email);
            if(user == null) return new UserDto() { error = "Email or password does not match!" };
            if (user.Password != null && BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return new UserDto()
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    isAdmin = user.isAdmin,
                };
            }
            else 
            {
                return new UserDto() { error = "Email or password does not match!" };
            }
        }

        public async Task<List<Trip>> GetAllTrips(string userId)
        {
            var user = await _unitOfWork.Users.GetById(userId);
            return user.Trips.ToList();
        }
    }
}
