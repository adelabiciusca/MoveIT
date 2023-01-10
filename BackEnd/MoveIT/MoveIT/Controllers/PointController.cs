using Microsoft.AspNetCore.Mvc;
using MoveIt.BusinessLogic.IServices;
using MoveIt.BusinessLogic.Services;
using MoveIT.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace MoveIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointController : ControllerBase
    {
        private readonly IPointService _pointService;

        public PointController(IPointService pointService)
        {
            _pointService = pointService ?? throw new ArgumentNullException(nameof(pointService));
        }

        [HttpDelete]
        public async Task<IActionResult> DeletePoint(string pointId)
        {
            await _pointService.DeletePoint(pointId);
            return Ok();
        }
    }
}
