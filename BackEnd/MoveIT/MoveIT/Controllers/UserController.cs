using Microsoft.AspNetCore.Mvc;
using MoveIt.BusinessLogic.IServices;
using MoveIT.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace MoveIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userServices;

        public UserController(IUserService userServices)
        {
            _userServices = userServices ?? throw new ArgumentNullException(nameof(userServices));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userServices.GetAll();
            return Ok(users);
        }

        [HttpGet]
        [Route("trips/{Id}")]
        public async Task<IActionResult> GetAllTrips(string Id)
        {
            var trips = await _userServices.GetAllTrips(Id);
            return Ok(trips);
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<IActionResult> GetById(string Id)
        {
            var user = await _userServices.GetById(Id);
            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string name, string email, string password)
        {
            var response = await _userServices.Register(name, email, password);
            if (response.error != null) return Conflict(response.error);
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var response = await _userServices.Login(email, password);
            if (response.error != null) return Conflict(response.error);
            return Ok(response);
        }

        [HttpPut]
        [Route("{Id}")]
        public async Task<IActionResult> Update(string Id, string name)
        {
            var user = await _userServices.GetById(Id);
            user.Name= name;
            await _userServices.Update(user);
            return Ok(user);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(string Id)
        {
            await _userServices.Delete(Id);
            return Ok();
        }
    }
}
