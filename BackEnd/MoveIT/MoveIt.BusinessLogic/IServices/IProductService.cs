using MoveIT.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MoveIt.BusinessLogic.IServices
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAll();
        Task<bool> ClaimProduct(string productId, string userId);
        Task<Product> Create(string name, int price);
    }
}
