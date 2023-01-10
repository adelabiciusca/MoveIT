using Microsoft.AspNetCore.Mvc;
using MoveIt.BusinessLogic.IServices;
using MoveIt.BusinessLogic.Services;
using MoveIT.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace MoveIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripServices;

        public TripController(ITripService tripService)
        {
            _tripServices = tripService ?? throw new ArgumentNullException(nameof(tripService));
        }

        [HttpGet("userTrip")]
        public async Task<IActionResult> GetTripByUserId(string userId)
        {
            var response = await _tripServices.GetTripByUserId(userId);
            if(response == null) { return Conflict("id not found"); }
            return Ok(response);
        }

        [HttpPost("endtrip")]
        public async Task<IActionResult> EndTrip(string tripId, string userId)
        {
            var response = await _tripServices.EndTrip(tripId, userId);

            return Ok(response);
        }

        [HttpPost("starttrip")]
        public async Task<IActionResult> StartTrip(float latitude, float longitude, string userId)
        {
            var response = await _tripServices.StartTrip(latitude, longitude, userId);

            return Ok(response);
        }
    }
}
