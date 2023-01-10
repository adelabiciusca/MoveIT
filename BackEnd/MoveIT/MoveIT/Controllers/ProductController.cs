using Microsoft.AspNetCore.Mvc;
using MoveIt.BusinessLogic.IServices;
using MoveIt.BusinessLogic.Services;
using MoveIT.Domain.Models;
using System.ComponentModel.DataAnnotations;

namespace MoveIT.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _productService.GetAll();
            return Ok(users);
        }

        [HttpDelete]
        public async Task<IActionResult> ClaimProduct(string productId, string userId)
        {
            await _productService.ClaimProduct(productId, userId);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> Create(string name, int price)
        {
            var response = await _productService.Create(name, price);
            return Ok(response);
        }
    }
}
